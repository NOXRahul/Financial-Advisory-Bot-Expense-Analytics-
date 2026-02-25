"""
advisor.py
----------
Intelligent financial advice generation module.

Generates context-aware, personalized financial advice by analyzing:
  - Savings rate
  - Risk score
  - Spending category breakdown
  - Detected anomalies
  - Spending predictions and trends
  - Specific problem areas (high dining, no emergency fund logic, etc.)
"""

import pandas as pd
from dataclasses import dataclass, field
from typing import List


# ---------------------------------------------------------------------------
# Advice severity levels (used for formatting / priority)
# ---------------------------------------------------------------------------
LEVEL_CRITICAL = "🔴 CRITICAL"
LEVEL_WARNING  = "🟡 WARNING"
LEVEL_GOOD     = "🟢 GOOD"
LEVEL_TIP      = "💡 TIP"


@dataclass
class AdviceItem:
    """A single piece of financial advice with context."""
    level: str
    category: str
    message: str
    action: str


@dataclass
class FinancialReport:
    """Complete financial advisory report."""
    savings_ratio: float
    risk_score: float
    predicted_spending: float
    trend: str
    advice_items: List[AdviceItem] = field(default_factory=list)
    anomaly_count: int = 0
    top_category: str = ""
    top_category_pct: float = 0.0


def generate_advice(
    summary: pd.DataFrame,
    breakdown: pd.DataFrame,
    anomalies: pd.DataFrame,
    prediction: dict,
    metrics: dict,
    risk_score: float,
) -> FinancialReport:
    """
    Generate a comprehensive set of financial advice items.

    The advice engine evaluates multiple financial health indicators and
    produces prioritized, actionable recommendations.

    Parameters
    ----------
    summary : pd.DataFrame
        Monthly summary from analytics.monthly_summary().
    breakdown : pd.DataFrame
        Category spending breakdown from analytics.category_breakdown().
    anomalies : pd.DataFrame
        Flagged anomalous transactions from anomaly.summarize_anomalies().
    prediction : dict
        Next-month prediction from predictor.predict_next_month().
    metrics : dict
        Model metrics from predictor.train_spending_predictor().
    risk_score : float
        Financial risk score from analytics.calculate_risk_score().

    Returns
    -------
    FinancialReport
        Structured report containing advice items and key metrics.
    """
    advice: List[AdviceItem] = []
    avg_savings_ratio = summary["savings_ratio"].mean()
    avg_income = summary["total_income"].mean()
    avg_expenses = summary["total_expenses"].mean()

    top_row = breakdown.iloc[0] if not breakdown.empty else None
    top_category = top_row["category"] if top_row is not None else "N/A"
    top_pct = top_row["pct_of_spending"] if top_row is not None else 0.0

    # ------------------------------------------------------------------ #
    # 1. Savings Rate Analysis
    # ------------------------------------------------------------------ #
    if avg_savings_ratio < 0:
        advice.append(AdviceItem(
            level=LEVEL_CRITICAL,
            category="Savings",
            message=f"You are spending MORE than you earn! Average deficit: "
                    f"${abs(summary['net_savings'].mean()):,.2f}/month.",
            action="Immediately cut non-essential expenses. Review subscriptions, "
                   "dining, and entertainment spending.",
        ))
    elif avg_savings_ratio < 0.10:
        advice.append(AdviceItem(
            level=LEVEL_WARNING,
            category="Savings",
            message=f"Low savings rate of {avg_savings_ratio:.1%}. "
                    f"Financial experts recommend saving at least 20% of income.",
            action="Automate savings transfers on payday. Try the 50/30/20 rule: "
                   "50% needs, 30% wants, 20% savings.",
        ))
    elif avg_savings_ratio < 0.20:
        advice.append(AdviceItem(
            level=LEVEL_WARNING,
            category="Savings",
            message=f"Savings rate of {avg_savings_ratio:.1%} is below the recommended 20%.",
            action="Look for quick wins: cancel unused subscriptions, meal prep "
                   "instead of dining out, review insurance premiums.",
        ))
    else:
        advice.append(AdviceItem(
            level=LEVEL_GOOD,
            category="Savings",
            message=f"Excellent savings rate of {avg_savings_ratio:.1%}! "
                    f"You save ~${summary['net_savings'].mean():,.2f}/month on average.",
            action="Consider investing surplus savings into an index fund or "
                   "increase retirement contributions (401k/IRA).",
        ))

    # ------------------------------------------------------------------ #
    # 2. Risk Score Analysis
    # ------------------------------------------------------------------ #
    if risk_score >= 70:
        advice.append(AdviceItem(
            level=LEVEL_CRITICAL,
            category="Risk",
            message=f"High financial risk score: {risk_score}/100. "
                    "Your finances show signs of instability.",
            action="Build a 3–6 month emergency fund immediately. "
                   "Reduce discretionary spending and avoid high-risk purchases.",
        ))
    elif risk_score >= 40:
        advice.append(AdviceItem(
            level=LEVEL_WARNING,
            category="Risk",
            message=f"Moderate risk score: {risk_score}/100. "
                    "Some months show irregular or high-variance spending.",
            action="Stabilize monthly expenses. Create a budget and track "
                   "spending weekly to reduce volatility.",
        ))
    else:
        advice.append(AdviceItem(
            level=LEVEL_GOOD,
            category="Risk",
            message=f"Low risk score: {risk_score}/100. "
                    "Your spending patterns are consistent and manageable.",
            action="Maintain your financial discipline. "
                   "Consider reviewing investments to ensure appropriate growth.",
        ))

    # ------------------------------------------------------------------ #
    # 3. Top Spending Category
    # ------------------------------------------------------------------ #
    if top_category == "Housing" and top_pct > 35:
        advice.append(AdviceItem(
            level=LEVEL_WARNING,
            category="Housing",
            message=f"Housing consumes {top_pct:.1f}% of your spending — above the "
                    f"recommended 30% threshold.",
            action="Explore options: refinancing, finding a roommate, or "
                   "downsizing if rent is too high relative to income.",
        ))
    elif top_category == "Dining" and top_pct > 15:
        advice.append(AdviceItem(
            level=LEVEL_WARNING,
            category="Dining",
            message=f"Dining out accounts for {top_pct:.1f}% of your expenses.",
            action="Meal prep 3–4 days per week. Limit restaurant visits to weekends "
                   "and use cashback credit cards for dining rewards.",
        ))
    elif top_category == "Shopping" and top_pct > 20:
        advice.append(AdviceItem(
            level=LEVEL_WARNING,
            category="Shopping",
            message=f"Discretionary shopping is {top_pct:.1f}% of spending.",
            action="Implement a 48-hour rule: wait 2 days before making non-essential "
                   "purchases. Unsubscribe from marketing emails.",
        ))
    else:
        advice.append(AdviceItem(
            level=LEVEL_TIP,
            category=top_category,
            message=f"Your largest expense category is '{top_category}' "
                    f"at {top_pct:.1f}% of total spending.",
            action=f"Regularly review {top_category} spending to ensure it aligns "
                   "with your financial goals.",
        ))

    # ------------------------------------------------------------------ #
    # 4. Anomaly Detection Advice
    # ------------------------------------------------------------------ #
    n_anomalies = len(anomalies)
    if n_anomalies > 0:
        anomaly_total = anomalies["amount"].abs().sum()
        largest = anomalies.iloc[0]
        advice.append(AdviceItem(
            level=LEVEL_WARNING,
            category="Anomalies",
            message=f"Detected {n_anomalies} unusual transaction(s) totaling "
                    f"${anomaly_total:,.2f}. Largest: '{largest['description']}' "
                    f"(${abs(largest['amount']):,.2f}).",
            action="Review these transactions for errors, fraud, or one-time costs. "
                   "Set up bank alerts for transactions above your typical range.",
        ))

    # ------------------------------------------------------------------ #
    # 5. Spending Prediction Advice
    # ------------------------------------------------------------------ #
    predicted = prediction["predicted_spending"]
    lower = prediction["lower_bound"]
    upper = prediction["upper_bound"]
    trend = prediction["trend"]

    if "Increasing" in trend:
        advice.append(AdviceItem(
            level=LEVEL_WARNING,
            category="Forecast",
            message=f"Spending trend is INCREASING. Predicted next month: "
                    f"${predicted:,.2f} (range: ${lower:,.2f}–${upper:,.2f}).",
            action="Proactively set a monthly budget cap. Identify which categories "
                   "are driving the increase and create spending limits for each.",
        ))
    elif "Decreasing" in trend:
        advice.append(AdviceItem(
            level=LEVEL_GOOD,
            category="Forecast",
            message=f"Spending trend is DECREASING. Predicted next month: "
                    f"${predicted:,.2f} (range: ${lower:,.2f}–${upper:,.2f}).",
            action="Great momentum! Redirect the savings to investments or "
                   "accelerate debt repayment.",
        ))
    else:
        advice.append(AdviceItem(
            level=LEVEL_TIP,
            category="Forecast",
            message=f"Spending is stable. Predicted next month: "
                    f"${predicted:,.2f} (range: ${lower:,.2f}–${upper:,.2f}).",
            action="Stability is good, but explore ways to actively reduce "
                   "expenses and grow savings.",
        ))

    # ------------------------------------------------------------------ #
    # 6. General Best-Practice Tips (always included)
    # ------------------------------------------------------------------ #
    advice.append(AdviceItem(
        level=LEVEL_TIP,
        category="Emergency Fund",
        message="Ensure you have 3–6 months of expenses in a liquid emergency fund.",
        action=f"Target emergency fund size: "
               f"${avg_expenses * 3:,.2f}–${avg_expenses * 6:,.2f} "
               f"based on your average monthly expenses.",
    ))

    advice.append(AdviceItem(
        level=LEVEL_TIP,
        category="Debt & Investments",
        message="High-interest debt (credit cards >15% APR) should be paid before investing.",
        action="Use the avalanche method: pay minimums on all debts, throw extra "
               "money at the highest APR debt first.",
    ))

    return FinancialReport(
        savings_ratio=round(avg_savings_ratio, 4),
        risk_score=risk_score,
        predicted_spending=predicted,
        trend=trend,
        advice_items=advice,
        anomaly_count=n_anomalies,
        top_category=top_category,
        top_category_pct=top_pct,
    )


def format_report(report: FinancialReport) -> str:
    """
    Render a FinancialReport as a formatted console-friendly string.

    Parameters
    ----------
    report : FinancialReport

    Returns
    -------
    str
        Human-readable financial advisory report.
    """
    lines = []
    sep = "=" * 65

    lines.append(sep)
    lines.append("         🏦  FINANCIAL ADVISORY BOT — FULL REPORT")
    lines.append(sep)
    lines.append("")

    # Key Metrics
    lines.append("📊  KEY METRICS")
    lines.append("-" * 40)
    lines.append(f"  Avg Savings Ratio     : {report.savings_ratio:.1%}")
    lines.append(f"  Risk Score            : {report.risk_score}/100")
    lines.append(f"  Anomalies Detected    : {report.anomaly_count}")
    lines.append(f"  Top Expense Category  : {report.top_category} ({report.top_category_pct:.1f}%)")
    lines.append(f"  Spending Trend        : {report.trend}")
    lines.append(f"  Next Month Forecast   : ${report.predicted_spending:,.2f}")
    lines.append("")

    # Advice Items
    lines.append("🧠  PERSONALIZED ADVICE")
    lines.append("-" * 40)
    for i, item in enumerate(report.advice_items, 1):
        lines.append(f"\n  [{i}] {item.level}  —  {item.category}")
        lines.append(f"      {item.message}")
        lines.append(f"      ▶ Action: {item.action}")

    lines.append("")
    lines.append(sep)
    lines.append("  Always consult a certified financial planner for personalized")
    lines.append("  investment advice tailored to your complete financial picture.")
    lines.append(sep)

    return "\n".join(lines)
