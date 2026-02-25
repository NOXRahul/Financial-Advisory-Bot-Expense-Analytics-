"""
analytics.py
------------
Core financial analytics module.
Responsibilities:
  - Load and validate transaction CSV data
  - Categorize transactions using keyword-based NLP
  - Calculate savings ratio, monthly summaries, and risk score
"""

import pandas as pd
import numpy as np
from pathlib import Path
from typing import Optional


# ---------------------------------------------------------------------------
# Category keyword mapping (NLP rule engine)
# Keys = category labels, Values = keyword lists (case-insensitive matching)
# ---------------------------------------------------------------------------
CATEGORY_KEYWORDS: dict[str, list[str]] = {
    "Groceries": [
        "whole foods", "trader joe", "kroger", "safeway", "costco",
        "walmart", "aldi", "publix", "sprouts", "market", "grocery", "supermarket",
    ],
    "Dining": [
        "restaurant", "pizza", "sushi", "burger", "mcdonald", "chipotle",
        "starbucks", "coffee", "domino", "taco", "thai", "italian", "dinner",
        "lunch", "cafe", "bistro", "diner",
    ],
    "Transport": [
        "uber", "lyft", "gas station", "shell", "bp", "chevron", "exxon",
        "fuel", "parking", "transit", "metro", "taxi", "rideshare",
    ],
    "Utilities": [
        "electric", "electricity", "gas bill", "water bill", "internet",
        "phone bill", "utility", "power", "energy",
    ],
    "Entertainment": [
        "netflix", "spotify", "hulu", "disney", "cinema", "movie", "concert",
        "game", "apple store", "steam", "amazon prime", "subscription",
    ],
    "Health & Fitness": [
        "gym", "fitness", "planet fitness", "pharmacy", "cvs", "walgreens",
        "medical", "doctor", "health", "supplement", "hospital", "dental",
    ],
    "Shopping": [
        "amazon", "target", "clothing", "store", "online", "ebay", "mall",
        "shop", "retail",
    ],
    "Housing": [
        "rent", "mortgage", "hoa", "lease",
    ],
    "Education": [
        "course", "udemy", "coursera", "book", "school", "tuition", "training",
    ],
    "Income": [
        "salary", "deposit", "freelance", "payroll", "income", "bonus", "dividend",
    ],
    "Miscellaneous": [],  # catch-all
}


def categorize_transaction(description: str) -> str:
    """
    Classify a single transaction description into a spending category.

    Uses a greedy keyword scan: the first category whose keywords appear
    (as substrings) in the lowercase description wins.

    Parameters
    ----------
    description : str
        Raw transaction description string.

    Returns
    -------
    str
        Matched category label (falls back to 'Miscellaneous').
    """
    desc_lower = description.lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        if category == "Miscellaneous":
            continue
        for kw in keywords:
            if kw in desc_lower:
                return category
    return "Miscellaneous"


def load_transactions(filepath: str) -> pd.DataFrame:
    """
    Load transactions from a CSV file, validate schema, parse dates,
    and attach computed columns (category, month, abs_amount).

    Expected CSV columns: date, description, amount, type

    Parameters
    ----------
    filepath : str
        Path to the transactions CSV file.

    Returns
    -------
    pd.DataFrame
        Enriched transaction DataFrame.

    Raises
    ------
    FileNotFoundError
        If the CSV file does not exist.
    ValueError
        If required columns are missing.
    """
    path = Path(filepath)
    if not path.exists():
        raise FileNotFoundError(f"Transaction file not found: {filepath}")

    df = pd.read_csv(filepath, parse_dates=["date"])

    # --- Schema validation ---
    required_cols = {"date", "description", "amount", "type"}
    missing = required_cols - set(df.columns)
    if missing:
        raise ValueError(f"CSV missing required columns: {missing}")

    # --- Derived columns ---
    df["category"] = df["description"].apply(categorize_transaction)
    df["month"] = df["date"].dt.to_period("M")
    df["abs_amount"] = df["amount"].abs()

    # Separate debits/credits for clarity
    df["is_debit"] = df["amount"] < 0

    return df


def monthly_summary(df: pd.DataFrame) -> pd.DataFrame:
    """
    Aggregate transactions into a per-month summary table.

    Columns produced:
      - total_income   : sum of all positive (credit) transactions
      - total_expenses : sum of absolute values of negative (debit) transactions
      - net_savings    : total_income - total_expenses
      - savings_ratio  : net_savings / total_income  (clamped to [-1, 1])
      - num_transactions: count of all transactions that month

    Parameters
    ----------
    df : pd.DataFrame
        Enriched transaction DataFrame from load_transactions().

    Returns
    -------
    pd.DataFrame
        Monthly summary indexed by period.
    """
    credits = df[~df["is_debit"]].groupby("month")["amount"].sum().rename("total_income")
    debits = df[df["is_debit"]].groupby("month")["abs_amount"].sum().rename("total_expenses")
    count = df.groupby("month")["amount"].count().rename("num_transactions")

    summary = pd.concat([credits, debits, count], axis=1).fillna(0)
    summary["net_savings"] = summary["total_income"] - summary["total_expenses"]
    summary["savings_ratio"] = (
        summary["net_savings"] / summary["total_income"].replace(0, np.nan)
    ).clip(-1, 1).fillna(0)

    return summary.reset_index()


def category_breakdown(df: pd.DataFrame) -> pd.DataFrame:
    """
    Compute total and percentage spend per category (debits only).

    Parameters
    ----------
    df : pd.DataFrame
        Enriched transaction DataFrame.

    Returns
    -------
    pd.DataFrame
        DataFrame with columns: category, total_spent, pct_of_spending.
    """
    debits = df[df["is_debit"]].copy()
    breakdown = (
        debits.groupby("category")["abs_amount"]
        .sum()
        .reset_index()
        .rename(columns={"abs_amount": "total_spent"})
        .sort_values("total_spent", ascending=False)
    )
    total = breakdown["total_spent"].sum()
    breakdown["pct_of_spending"] = (breakdown["total_spent"] / total * 100).round(2)
    return breakdown


def calculate_risk_score(df: pd.DataFrame, summary: pd.DataFrame) -> float:
    """
    Compute a composite financial risk score in the range [0, 100].

    Higher score = higher financial risk. Components:
      1. Low savings ratio        (weight 40)
      2. High spending volatility (weight 30)
      3. Anomalous large expenses (weight 30)

    Parameters
    ----------
    df : pd.DataFrame
        Enriched transaction DataFrame.
    summary : pd.DataFrame
        Monthly summary from monthly_summary().

    Returns
    -------
    float
        Risk score between 0 and 100.
    """
    # Component 1: savings ratio risk (lower savings → higher risk)
    avg_savings_ratio = summary["savings_ratio"].mean()
    savings_risk = max(0.0, 1.0 - avg_savings_ratio) * 40  # 0–40

    # Component 2: expense volatility across months
    expense_std = summary["total_expenses"].std()
    expense_mean = summary["total_expenses"].mean()
    cv = (expense_std / expense_mean) if expense_mean > 0 else 0
    volatility_risk = min(cv, 1.0) * 30  # 0–30

    # Component 3: proportion of transactions > 3× median spend
    debits = df[df["is_debit"]]["abs_amount"]
    threshold = debits.median() * 3
    large_txn_pct = (debits > threshold).mean()
    large_txn_risk = large_txn_pct * 30  # 0–30

    risk_score = round(savings_risk + volatility_risk + large_txn_risk, 2)
    return min(risk_score, 100.0)
