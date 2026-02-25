# 🏦 Financial Advisory Bot — AI-Powered Personal Finance Intelligence

<div align="center">

![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-ML-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-Charts-22B5BF?style=for-the-badge)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-FF0055?style=for-the-badge&logo=framer&logoColor=white)

**A full-stack AI-powered personal finance dashboard that analyzes your bank transactions, detects anomalies using Machine Learning, predicts future spending, and delivers intelligent financial advice — all wrapped in a stunning dark red glassmorphism UI.**

[🚀 Live Demo](#) • [📦 Installation](#-installation) • [🧠 How It Works](#-how-it-works) • [📊 Features](#-features) • [🖼️ Screenshots](#-screenshots)

</div>

---

## 📸 Screenshots

| Dashboard | Risk Analysis |
|-----------|--------------|
| ![Dashboard](https://via.placeholder.com/600x340/0b0000/ef4444?text=Dashboard+View) | ![Risk](https://via.placeholder.com/600x340/0b0000/ef4444?text=Risk+Analysis) |

| Forecast | Reports |
|----------|---------|
| ![Forecast](https://via.placeholder.com/600x340/0b0000/ef4444?text=Forecast+Page) | ![Reports](https://via.placeholder.com/600x340/0b0000/ef4444?text=Reports+Page) |

---

## ✨ Features

### 🐍 Python AI Backend
- ✅ **CSV Transaction Loading** — Load any bank export CSV automatically
- ✅ **NLP Auto-Categorization** — Classifies transactions into 10 categories using keyword NLP
- ✅ **Isolation Forest Anomaly Detection** — Unsupervised ML flags unusual spending
- ✅ **Linear Regression Forecasting** — Predicts next month's spending with confidence intervals
- ✅ **Risk Score Engine** — Composite 0–100 financial risk scoring
- ✅ **AI Advisory Report** — Personalized actionable financial recommendations

### ⚛️ React Frontend Dashboard
- ✅ **6 Full Pages** — Dashboard, Analytics, Risk Analysis, Forecast, Reports, Settings
- ✅ **Real-time CSV Upload** — Upload your bank CSV and charts update instantly
- ✅ **Animated Charts** — Area, Bar, Pie, Radar, Line, Scatter charts via Recharts
- ✅ **Framer Motion Animations** — Smooth page transitions and card animations
- ✅ **Glassmorphism Dark UI** — Premium dark red themed professional design
- ✅ **Risk Gauge** — Animated circular SVG risk meter
- ✅ **Floating Particle Canvas** — Subtle animated background particles
- ✅ **Notification System** — Live anomaly alert bell with dropdown
- ✅ **Interactive Settings** — Toggle switches, sliders, currency selector
- ✅ **Transaction Table** — Searchable, filterable, color-coded transaction history
- ✅ **Fully Responsive** — Works on all screen sizes

---

## 🧠 How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR BANK CSV FILE                       │
│         date, description, amount, type                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  PYTHON AI ENGINE                           │
│                                                             │
│  analytics.py  →  Load, validate, categorize transactions   │
│  anomaly.py    →  Isolation Forest detects outliers         │
│  predictor.py  →  Linear Regression forecasts spending      │
│  advisor.py    →  Generate personalized financial advice    │
│  main.py       →  Orchestrates full pipeline                │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│               REACT DASHBOARD (finbot/)                     │
│                                                             │
│  📊 Dashboard    →  Overview of all metrics                 │
│  📈 Analytics    →  Deep spending pattern analysis          │
│  🛡️  Risk        →  6-factor risk assessment                │
│  🔮 Forecast     →  3-month AI spending prediction          │
│  📋 Reports      →  Full transaction history table          │
│  ⚙️  Settings    →  Preferences, alerts, security           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🤖 AI & Machine Learning

### Anomaly Detection — Isolation Forest
```python
from sklearn.ensemble import IsolationForest

model = IsolationForest(
    contamination=0.10,   # Expects ~10% anomalies
    n_estimators=200,     # 200 trees for stability
    random_state=42
)
```
- **Algorithm:** Isolation Forest (unsupervised ML)
- **Features used:** Transaction amount, day of week, day of month, category
- **Output:** Anomaly score — lower = more suspicious
- **Example detections:**
  ```
  ✅ Starbucks $6.75     → Normal
  🔴 Medical Bill $3,500 → ANOMALY (score: -0.104)
  🔴 Apple Store $999    → ANOMALY (score: -0.041)
  🔴 Casino Night $450   → ANOMALY (score: -0.038)
  ```

### Spending Prediction — Linear Regression
```python
from sklearn.linear_model import LinearRegression

# X = month index [0, 1, 2, ...]
# y = total_expenses per month
model = LinearRegression()
model.fit(X, y)
next_month_prediction = model.predict([[len(summary)]])
```
- **Algorithm:** Linear Regression on time-indexed monthly data
- **Output:** Point prediction + ±15% confidence interval
- **Trend detection:** Increasing ↑ / Decreasing ↓ / Stable →

### NLP Transaction Categorization
```python
CATEGORIES = {
    "Groceries":    ["whole foods", "trader joe", "kroger", "safeway"],
    "Dining":       ["restaurant", "starbucks", "mcdonald", "pizza"],
    "Transport":    ["uber", "lyft", "shell", "chevron", "gas station"],
    "Housing":      ["rent", "mortgage", "lease"],
    "Health":       ["pharmacy", "cvs", "walgreens", "medical", "gym"],
    "Entertainment":["netflix", "spotify", "apple store", "hulu"],
    ...
}
```

---

## 📁 Project Structure

```
financial-advisory-bot/
│
├── 📄 README.md
├── 📊 transactions.csv          ← Sample transaction data (76 rows)
│
├── 🐍 PYTHON BACKEND
│   ├── main.py                  ← Entry point — run this
│   ├── analytics.py             ← Data loading, NLP categorization, risk score
│   ├── anomaly.py               ← Isolation Forest anomaly detection
│   ├── predictor.py             ← Linear Regression spending forecast
│   └── advisor.py               ← Financial advice generation engine
│
└── ⚛️ finbot/                   ← React Frontend (Vite)
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx              ← Entire dashboard (6 pages, all components)
        ├── App.css              ← (Empty — all styles are inline)
        └── main.jsx             ← React entry point
```

---

## 📦 Installation

### Prerequisites
- **Python** 3.8 or higher → [Download](https://python.org)
- **Node.js** 18 or higher → [Download](https://nodejs.org)
- **npm** (comes with Node.js)

---

### 🐍 Python Backend Setup

**Step 1 — Clone the repository**
```bash
git clone https://github.com/NOXRahul/Financial-Advisory-Bot-Expense-Analytics-.git
cd Financial-Advisory-Bot-Expense-Analytics-
```

**Step 2 — Install Python dependencies**
```bash
pip install pandas numpy scikit-learn
```

**Step 3 — Run the AI analysis**
```bash
python main.py
```

**With your own CSV file:**
```bash
python main.py --csv your_bank_export.csv
```

**Adjust anomaly sensitivity:**
```bash
python main.py --contamination 0.05
```

---

### ⚛️ React Frontend Setup

**Step 1 — Navigate to the frontend folder**
```bash
cd finbot
```

**Step 2 — Install dependencies**
```bash
npm install
```

**Step 3 — Install required libraries**
```bash
npm install framer-motion recharts
```

**Step 4 — Start the development server**
```bash
npm run dev
```

**Step 5 — Open in browser**
```
http://localhost:5173
```

---

## 📊 CSV Format

Your bank transaction CSV must have these columns:

```csv
date,description,amount,type
2024-01-05,Salary Deposit,5500.00,credit
2024-01-10,Whole Foods Market,-85.50,debit
2024-01-18,Rent Payment,-1800.00,debit
2024-01-25,Apple Store,-999.00,debit
2024-01-29,Freelance Income,1200.00,credit
```

| Column | Type | Description |
|--------|------|-------------|
| `date` | YYYY-MM-DD | Transaction date |
| `description` | String | Merchant or transaction name |
| `amount` | Number | Positive = income, Negative = expense |
| `type` | credit/debit | Transaction type |

### How to Export from Your Bank

| Bank | Steps |
|------|-------|
| **Chase** | Accounts → Download Activity → CSV |
| **Bank of America** | Accounts → Statements → Export |
| **Wells Fargo** | Activity → Export → CSV |
| **Citi** | Account Details → Download → CSV |
| **Any Bank** | Look for "Export", "Download", or "Statements" |

---

## 🖥️ Dashboard Pages

### 🏠 1. Dashboard (Home)
- **Risk Score Gauge** — Circular 0–100 risk meter with color coding
- **Income vs Expenses Area Chart** — 3-line comparison with gradient fills
- **Savings Ratio** — Animated count-up with progress bar
- **Spending Breakdown Pie** — Donut chart of all spending categories
- **Anomaly Detection Cards** — AI-flagged suspicious transactions
- **Forecast Card** — Next month prediction with animated trend arrow
- **AI Advice Panel** — Expandable accordion with 5 personalized recommendations

### 📊 2. Analytics
- Weekly spending bar chart
- Day-of-week average spend (Friday/Saturday peaks visible)
- Category spending progress bars with animated fills
- Monthly cash flow line chart with 3 metrics

### 🛡️ 3. Risk Analysis
- Overall risk gauge + historical trend line
- 6-axis radar chart (Savings, Stability, Liquidity, Diversity, Debt, Emergency)
- Individual risk factor breakdown cards with score bars

### 🔮 4. Forecast
- Actual vs Predicted spending chart with confidence band
- 3-month forward projections
- Category-level forecasts with % change indicators
- AI insights cards (which categories will increase/decrease)

### 📋 5. Reports
- Full searchable transaction table
- Filter by All / Debit / Credit
- Color-coded amounts (green = income, red = expense)
- Status badges and export button

### ⚙️ 6. Settings
- Profile management
- Notification toggles (email, anomaly alerts, weekly reports)
- Anomaly threshold slider ($100 – $2000)
- Currency selector (USD / EUR / GBP / INR)
- Risk tolerance slider (Conservative → Aggressive)
- Security section (password, 2FA, data export)

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| **Primary Background** | `#060608` — Deep black |
| **Sidebar Background** | `#040006` — Near black |
| **Card Background** | `rgba(18,2,2,0.92)` — Dark glass |
| **Primary Red** | `#8B0000` — Dark crimson |
| **Accent Red** | `#ef4444` — Bright red glow |
| **Success Green** | `#22c55e` — Income/savings |
| **Warning Amber** | `#f59e0b` — Moderate risk |
| **Font (Numbers)** | JetBrains Mono |
| **Font (UI)** | Rajdhani |
| **Card Style** | Glassmorphism + backdrop-filter blur |
| **Animations** | Framer Motion spring physics |

---

## 🧪 Sample Output — Python Terminal

```
─────────────────────────────────────────────────────
  STEP 1/5 — Loading & Categorizing Transactions
─────────────────────────────────────────────────────
  ✔ Loaded 76 transactions (2024-01-02 → 2024-03-30)
  ✔ Categorized into 10 unique categories:
       Transport             12 transactions
       Health & Fitness      12 transactions
       Dining                12 transactions
       Groceries              8 transactions

─────────────────────────────────────────────────────
  STEP 2/5 — Detecting Anomalies (Isolation Forest)
─────────────────────────────────────────────────────
  ⚠  7 anomalous transaction(s) flagged:
       Medical Bill    -$3,500.00   score: -0.1039
       Apple Store       -$999.00   score: -0.0410
       Casino Night      -$450.00   score: -0.0380

─────────────────────────────────────────────────────
  STEP 3/5 — Monthly Summary & Risk Score
─────────────────────────────────────────────────────
  Month    Income    Expenses   Savings   Ratio
  2024-01  $6,700    $4,190     $2,510    37.5%
  2024-02  $6,300    $3,583     $2,717    43.1%
  2024-03  $7,000    $7,127     -$127     -1.8%

  Risk Score: 46.52/100

─────────────────────────────────────────────────────
  STEP 5/5 — Financial Advisory Report
─────────────────────────────────────────────────────
  [1] 🟢 GOOD  — Savings Rate 26.3%
      ▶ Invest surplus in index funds or boost 401k

  [2] 🟡 WARNING — Housing at 36.2% (above 30% limit)
      ▶ Explore refinancing or finding a roommate

  [3] 🔴 CRITICAL — 7 anomalies totaling $4,933
      ▶ Set bank alerts for unusual transactions
```

---

## 📈 Tech Stack

### Backend
| Library | Version | Purpose |
|---------|---------|---------|
| Python | 3.8+ | Core language |
| Pandas | Latest | Data manipulation |
| NumPy | Latest | Numerical computing |
| Scikit-learn | Latest | ML (Isolation Forest, Linear Regression) |

### Frontend
| Library | Version | Purpose |
|---------|---------|---------|
| React | 18+ | UI framework |
| Vite | 5+ | Build tool & dev server |
| Framer Motion | 10+ | Animations & transitions |
| Recharts | 2+ | Charts (Area, Bar, Pie, Radar, Line) |
| Google Fonts | — | JetBrains Mono + Rajdhani |

---

## 🚀 Quick Start (Copy & Paste)

```bash
# Clone
git clone https://github.com/NOXRahul/Financial-Advisory-Bot-Expense-Analytics-.git
cd Financial-Advisory-Bot-Expense-Analytics-

# Python backend
pip install pandas numpy scikit-learn
python main.py

# React frontend (new terminal)
cd finbot
npm install
npm install framer-motion recharts
npm run dev

# Open browser
# http://localhost:5173
```

---

## 🔮 Future Improvements

- [ ] Connect Python backend API to React frontend (FastAPI/Flask)
- [ ] Real-time bank API integration (Plaid API)
- [ ] User authentication (login/signup)
- [ ] Mobile app version (React Native)
- [ ] Export reports as PDF
- [ ] Email scheduled weekly reports
- [ ] Multi-currency support with live exchange rates
- [ ] Investment portfolio tracking
- [ ] Budget goal setting with progress tracking
- [ ] Dark/Light theme toggle

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Rahul Kafle**
- GitHub: [@NOXRahul](https://github.com/NOXRahul)
- Email: rrkafle2@gmail.com

---

## ⭐ Show Your Support

If this project helped you, please give it a **⭐ Star** on GitHub!

```
git clone https://github.com/NOXRahul/Financial-Advisory-Bot-Expense-Analytics-.git
```

---

<div align="center">

**Built with ❤️ using Python AI + React**

*Financial Advisory Bot — Making personal finance intelligent*

</div>
