"""
anomaly.py
----------
Anomaly detection module using Isolation Forest.

Isolation Forest is an unsupervised algorithm well-suited for financial
anomaly detection because it:
  - Requires no labeled data
  - Works effectively on high-dimensional tabular data
  - Is computationally efficient
  - Naturally handles skewed distributions common in spending data
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from typing import Tuple


def build_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Engineer numerical features for anomaly detection from raw transactions.

    Features extracted:
      - abs_amount        : transaction magnitude
      - day_of_week       : spending pattern by weekday (0=Mon, 6=Sun)
      - day_of_month      : beginning/end-of-month patterns
      - is_weekend        : binary weekend flag
      - category_encoded  : ordinal category encoding

    Parameters
    ----------
    df : pd.DataFrame
        Enriched transaction DataFrame with 'date', 'abs_amount', 'category'.

    Returns
    -------
    pd.DataFrame
        Feature matrix ready for Isolation Forest.
    """
    features = pd.DataFrame()
    features["abs_amount"] = df["abs_amount"]
    features["day_of_week"] = df["date"].dt.dayofweek
    features["day_of_month"] = df["date"].dt.day
    features["is_weekend"] = (df["date"].dt.dayofweek >= 5).astype(int)

    # Ordinal encode categories
    categories = df["category"].unique().tolist()
    cat_map = {cat: idx for idx, cat in enumerate(sorted(categories))}
    features["category_encoded"] = df["category"].map(cat_map).fillna(0)

    return features


def detect_anomalies(
    df: pd.DataFrame,
    contamination: float = 0.1,
    random_state: int = 42,
) -> Tuple[pd.DataFrame, IsolationForest]:
    """
    Detect anomalous transactions using Isolation Forest.

    The function:
      1. Builds a feature matrix from transaction data
      2. Scales features with StandardScaler
      3. Fits IsolationForest on debit transactions only
      4. Tags anomalies with a boolean column and anomaly score

    Parameters
    ----------
    df : pd.DataFrame
        Enriched transaction DataFrame from analytics.load_transactions().
    contamination : float
        Expected proportion of anomalies (0–0.5). Default 0.1 (10%).
    random_state : int
        Reproducibility seed.

    Returns
    -------
    Tuple[pd.DataFrame, IsolationForest]
        - DataFrame with added columns: 'is_anomaly', 'anomaly_score'
        - Fitted IsolationForest model (for reuse / persistence)
    """
    result_df = df.copy()
    result_df["is_anomaly"] = False
    result_df["anomaly_score"] = 0.0

    # Only score debit transactions (expenses)
    debit_mask = result_df["is_debit"]
    debit_df = result_df[debit_mask].copy()

    if len(debit_df) < 10:
        print("[anomaly] Warning: Too few transactions for reliable anomaly detection.")
        return result_df, None

    # Build and scale feature matrix
    features = build_features(debit_df)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(features)

    # Fit Isolation Forest
    model = IsolationForest(
        contamination=contamination,
        n_estimators=200,       # more trees = more stable predictions
        max_samples="auto",
        random_state=random_state,
        n_jobs=-1,              # use all CPU cores
    )
    predictions = model.fit_predict(X_scaled)   # -1 = anomaly, 1 = normal
    scores = model.decision_function(X_scaled)  # lower = more anomalous

    # Map back to original DataFrame
    result_df.loc[debit_mask, "is_anomaly"] = predictions == -1
    result_df.loc[debit_mask, "anomaly_score"] = np.round(scores, 4)

    return result_df, model


def summarize_anomalies(df: pd.DataFrame) -> pd.DataFrame:
    """
    Extract and format flagged anomalous transactions for reporting.

    Parameters
    ----------
    df : pd.DataFrame
        DataFrame returned by detect_anomalies() (contains 'is_anomaly').

    Returns
    -------
    pd.DataFrame
        Filtered DataFrame of anomalous transactions sorted by anomaly score.
    """
    anomalies = df[df["is_anomaly"]].copy()
    anomalies = anomalies.sort_values("anomaly_score")  # most anomalous first
    return anomalies[
        ["date", "description", "amount", "category", "anomaly_score"]
    ].reset_index(drop=True)
