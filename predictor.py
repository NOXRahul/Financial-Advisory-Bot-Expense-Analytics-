"""
predictor.py
------------
Spending prediction module using Linear Regression.

Trains a simple time-indexed linear model on monthly expense totals
to forecast the next month's spending. Also provides a confidence
interval and trend direction analysis.
"""

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score
from typing import Tuple, Optional


def prepare_time_series(summary: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
    """
    Convert monthly summary into (X, y) arrays for regression.

    X = month index (0, 1, 2, …)
    y = total_expenses per month

    Parameters
    ----------
    summary : pd.DataFrame
        Monthly summary DataFrame from analytics.monthly_summary().

    Returns
    -------
    Tuple[np.ndarray, np.ndarray]
        Feature array X (shape n×1) and target array y (shape n,).
    """
    n = len(summary)
    X = np.arange(n).reshape(-1, 1)
    y = summary["total_expenses"].values
    return X, y


def train_spending_predictor(
    summary: pd.DataFrame,
) -> Tuple[LinearRegression, dict]:
    """
    Fit a LinearRegression model to predict monthly spending.

    Parameters
    ----------
    summary : pd.DataFrame
        Monthly summary from analytics.monthly_summary().

    Returns
    -------
    Tuple[LinearRegression, dict]
        - Fitted LinearRegression model
        - Metrics dict: {mae, r2, slope, intercept}
    """
    X, y = prepare_time_series(summary)

    model = LinearRegression()
    model.fit(X, y)

    y_pred = model.predict(X)
    metrics = {
        "mae": round(mean_absolute_error(y, y_pred), 2),
        "r2": round(r2_score(y, y_pred) if len(y) > 1 else 0.0, 4),
        "slope": round(float(model.coef_[0]), 2),
        "intercept": round(float(model.intercept_), 2),
    }

    return model, metrics


def predict_next_month(
    model: LinearRegression,
    summary: pd.DataFrame,
    confidence_pct: float = 0.15,
) -> dict:
    """
    Predict total spending for the next (upcoming) month.

    Also returns a simple confidence band (±confidence_pct of prediction)
    and a trend label based on the model slope.

    Parameters
    ----------
    model : LinearRegression
        Fitted model from train_spending_predictor().
    summary : pd.DataFrame
        Monthly summary used to determine the next month index.
    confidence_pct : float
        Fraction of prediction to use as ±confidence interval. Default 15%.

    Returns
    -------
    dict
        {
          "next_month_index"   : int,
          "predicted_spending" : float,
          "lower_bound"        : float,
          "upper_bound"        : float,
          "trend"              : str,  # "Increasing" | "Decreasing" | "Stable"
        }
    """
    next_idx = len(summary)
    prediction = float(model.predict([[next_idx]])[0])
    margin = prediction * confidence_pct

    slope = float(model.coef_[0])
    if slope > 20:
        trend = "Increasing ↑"
    elif slope < -20:
        trend = "Decreasing ↓"
    else:
        trend = "Stable →"

    return {
        "next_month_index": next_idx,
        "predicted_spending": round(prediction, 2),
        "lower_bound": round(max(0, prediction - margin), 2),
        "upper_bound": round(prediction + margin, 2),
        "trend": trend,
    }


def category_trend(df: pd.DataFrame) -> pd.DataFrame:
    """
    Compute month-over-month spending change per category.

    Parameters
    ----------
    df : pd.DataFrame
        Enriched transaction DataFrame.

    Returns
    -------
    pd.DataFrame
        Pivot table of monthly category spending with a 'change_pct' column
        representing the percentage change from first to last month.
    """
    debits = df[df["is_debit"]].copy()
    pivot = (
        debits.groupby(["month", "category"])["abs_amount"]
        .sum()
        .unstack(fill_value=0)
    )

    if len(pivot) < 2:
        return pivot

    # Percentage change from first to last recorded month
    change = ((pivot.iloc[-1] - pivot.iloc[0]) / pivot.iloc[0].replace(0, np.nan) * 100).round(2)
    pivot.loc["change_pct %"] = change

    return pivot
