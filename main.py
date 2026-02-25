"""
main.py
-------
Financial Advisory Bot — Entry Point

Orchestrates the full analytics pipeline:
  1. Load transactions
  2. Detect anomalies
  3. Compute monthly summaries + risk score
  4. Train spending predictor and forecast next month
  5. Generate and print financial advisory report

Usage:
  python main.py                          # uses default transactions.csv
  python main.py --csv my_data.csv       # custom CSV path
  python main.py --contamination 0.05    # tune anomaly sensitivity
"""

import argparse
import sys
from pathlib import Path

# --- Local modules ---
import analytics
import anomaly
import predictor
import advisor


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def print_section(title: str) -> None:
    print(f"\n{'─' * 55}")
    print(f"  {title}")
    print(f"{'─' * 55}")


def run_pipeline(csv_path: str, contamination: float) -> None:
    """
    Execute the complete Financial Advisory Bot pipeline.

    Parameters
    ----------
    csv_path : str
        Path to the transactions CSV file.
    contamination : float
        Isolation Forest contamination rate (proportion of anomalies).
    """

    # ------------------------------------------------------------------
    # STEP 1: Load & Categorize Transactions
    # ------------------------------------------------------------------
    print_section("STEP 1/5 — Loading & Categorizing Transactions")
    df = analytics.load_transactions(csv_path)
    print(f"  ✔ Loaded {len(df)} transactions spanning "
          f"{df['date'].min().date()} → {df['date'].max().date()}")
    print(f"  ✔ Categorized into {df['category'].nunique()} unique categories:")
    for cat, count in df["category"].value_counts().items():
        print(f"       {cat:<20} {count:>3} transactions")

    # ------------------------------------------------------------------
    # STEP 2: Anomaly Detection
    # ------------------------------------------------------------------
    print_section("STEP 2/5 — Detecting Anomalies (Isolation Forest)")
    df_flagged, iso_model = anomaly.detect_anomalies(df, contamination=contamination)
    anomalies_df = anomaly.summarize_anomalies(df_flagged)

    if anomalies_df.empty:
        print("  ✔ No anomalies detected.")
    else:
        print(f"  ⚠  {len(anomalies_df)} anomalous transaction(s) flagged:\n")
        print(anomalies_df.to_string(index=False))

    # ------------------------------------------------------------------
    # STEP 3: Monthly Summary & Risk Score
    # ------------------------------------------------------------------
    print_section("STEP 3/5 — Monthly Summary & Risk Score")
    summary = analytics.monthly_summary(df_flagged)
    breakdown = analytics.category_breakdown(df_flagged)
    risk_score = analytics.calculate_risk_score(df_flagged, summary)

    print("\n  Monthly Summary:")
    display_cols = ["month", "total_income", "total_expenses", "net_savings", "savings_ratio"]
    print(summary[display_cols].to_string(index=False))

    print(f"\n  Financial Risk Score: {risk_score}/100")

    print("\n  Category Spending Breakdown (expenses only):")
    print(breakdown.to_string(index=False))

    # ------------------------------------------------------------------
    # STEP 4: Predict Next Month's Spending
    # ------------------------------------------------------------------
    print_section("STEP 4/5 — Predicting Next Month's Spending")
    model, metrics = predictor.train_spending_predictor(summary)
    prediction = predictor.predict_next_month(model, summary)

    print(f"  Model Performance: MAE=${metrics['mae']:,.2f} | R²={metrics['r2']}")
    print(f"  Spending Trend   : {prediction['trend']}")
    print(f"  Next Month Forecast: ${prediction['predicted_spending']:,.2f} "
          f"(${prediction['lower_bound']:,.2f} – ${prediction['upper_bound']:,.2f})")

    print("\n  Category Trend (First → Last Month % Change):")
    try:
        trend_table = predictor.category_trend(df_flagged)
        # Show only the change_pct row for clarity
        if "change_pct %" in trend_table.index:
            changes = trend_table.loc["change_pct %"].dropna().sort_values()
            for cat, pct in changes.items():
                arrow = "↑" if pct > 0 else "↓"
                print(f"    {cat:<22} {arrow} {pct:+.1f}%")
    except Exception as e:
        print(f"  (Could not compute category trends: {e})")

    # ------------------------------------------------------------------
    # STEP 5: Generate Advisory Report
    # ------------------------------------------------------------------
    print_section("STEP 5/5 — Generating Financial Advice")
    report = advisor.generate_advice(
        summary=summary,
        breakdown=breakdown,
        anomalies=anomalies_df,
        prediction=prediction,
        metrics=metrics,
        risk_score=risk_score,
    )
    print(advisor.format_report(report))


# ---------------------------------------------------------------------------
# CLI Entry Point
# ---------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Financial Advisory Bot — AI-powered personal finance analyzer",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--csv",
        default="transactions.csv",
        help="Path to transactions CSV file (default: transactions.csv)",
    )
    parser.add_argument(
        "--contamination",
        type=float,
        default=0.10,
        help="Anomaly detection sensitivity: expected fraction of anomalies (0–0.5). "
             "Default: 0.10",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()

    if not Path(args.csv).exists():
        print(f"[ERROR] CSV file not found: {args.csv}")
        sys.exit(1)

    if not (0 < args.contamination < 0.5):
        print("[ERROR] --contamination must be between 0 and 0.5 (exclusive).")
        sys.exit(1)

    run_pipeline(csv_path=args.csv, contamination=args.contamination)
