# FinanceOS — Finance Dashboard UI

A clean, interactive, and production-quality Finance Dashboard built as a frontend internship assignment. Built with React, Tailwind CSS, and mock data — no backend required.

---

## Live Demo

The app runs at the root path `/` and is fully functional out of the box with 60 pre-loaded mock transactions.

---

## Setup Instructions

### Prerequisites

- Node.js 22+
- npm 11+

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd <repo-folder>

# Install all workspace dependencies
npm install
```

### Running in Development

```bash
# Start the finance dashboard
npm run dev
```

The app will be available at `http://localhost:<PORT>` (port is assigned automatically by the environment).

### Building for Production

```bash
npm run build
```

### Type Checking

```bash
npm run typecheck
```

---

## Project Structure

```
artifacts/finance-dashboard/
├── src/
│   ├── components/
│   │   ├── dashboard/          # Chart and summary components
│   │   │   ├── BalanceTrendChart.tsx
│   │   │   ├── MonthlyComparisonChart.tsx
│   │   │   ├── RecentTransactions.tsx
│   │   │   └── SpendingBreakdownChart.tsx
│   │   ├── layout/             # App shell
│   │   │   ├── Header.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── transactions/       # Transaction modal form
│   │   │   └── TransactionModal.tsx
│   │   └── ui/                 # Shared UI primitives
│   │       └── StatCard.tsx
│   ├── context/
│   │   └── AppContext.tsx      # Global state (role, theme, transactions, filters)
│   ├── data/
│   │   └── mockData.ts         # 60 mock transactions + derived data helpers
│   ├── lib/
│   │   └── utils.ts            # Formatting, export helpers, cn()
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Insights.tsx
│   │   ├── Settings.tsx
│   │   ├── Transactions.tsx
│   │   └── not-found.tsx
│   ├── App.tsx                 # Router + providers
│   ├── index.css               # Tailwind + CSS custom properties (light & dark theme)
│   └── main.tsx
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React 18 + Vite | Fast HMR, modern JSX transform, lightweight bundle |
| Styling | Tailwind CSS v4 | Utility-first, co-located styles, built-in responsive design |
| Routing | Wouter | Minimal router, no boilerplate, compatible with Vite base paths |
| State | React Context + useReducer-style hooks | Fits the data shape — flat, synchronous, no async coordination needed |
| Charts | Recharts | Composable JSX API, React-native, responsive out of the box |
| Animations | Framer Motion | Declarative `initial`/`animate`/`exit` API, spring physics |
| Persistence | localStorage | Zero-dependency client-side persistence for demo purposes |
| Language | TypeScript | Full type safety across data models, components, and context |

---

## Approach Overview

The app is built as a single-page application with client-side routing. All data lives in a React Context (`AppContext`) which is initialized from `localStorage` on mount and written back on every change — giving the app real persistence across page refreshes without any server.

The mock dataset contains 60 realistic transactions across four months (January–April 2025), designed to produce meaningful chart shapes: monthly salary, recurring subscriptions, a travel spike in March, and a raise in April. Helper functions in `mockData.ts` derive aggregated views (monthly totals, category breakdowns, running balance) from this raw data.

The component architecture follows a single-responsibility principle. Each chart is an isolated component, the modal owns its own local form state, and the global Context only holds what genuinely needs to be shared (transactions, filters, role, theme). This makes individual parts easy to read, test, and extend.

---

## Feature Walkthrough

### Dashboard

The main overview page. Loads on startup.

- **4 Summary Cards** — Total Balance, Total Income, Total Expenses, Savings Rate. Each shows a percentage change badge and a gradient icon.
- **Balance Trend Chart** — Area chart of the running account balance over time, from January through April. Uses a dashed reference line for the starting balance.
- **Spending Breakdown** — Donut chart of expenses by category, with percentage labels and a colour legend.
- **Monthly Overview** — Grouped bar chart comparing Income vs Expenses side by side for each month.
- **Recent Transactions** — The 5 most recent transactions with category colour coding and quick-link to the full list.

---

### Transactions

Full transaction management page.

- **Search** — Real-time text search across description, merchant, and category fields.
- **Filters Panel** — Expandable panel with Type (Income / Expense / All), Category, Date From, and Date To filters. An active-filter count badge appears on the button when filters are set.
- **Sorting** — Click any column header (Description, Date, Amount) to sort ascending or descending. Active sort direction is indicated with an arrow icon.
- **Summary Bar** — Shows the count of matching transactions and the total income and expenses for the current filtered view.
- **Export** — Dropdown to export the current filtered view as CSV or JSON. Files download directly in the browser.
- **Add Transaction** *(Admin only)* — Opens a modal form with validation. Fields: type toggle (Income/Expense), description, amount, date, category, merchant, and notes.
- **Edit Transaction** *(Admin only)* — Click the pencil icon on any row to open the same modal pre-filled.
- **Delete Transaction** *(Admin only)* — Click the trash icon, confirm in a dialog.
- **Empty State** — Friendly message with a "Clear Filters" button when no transactions match the current filters.

---

### Insights

Data analysis page with five visual sections.

- **Key Insight Cards** — Top Spending Category, Best Month, Tightest Month, Savings Rate (with goal comparison), and Average Monthly Expenses.
- **Spending by Category** — Horizontal bar chart ranked by total spend across all months.
- **Monthly Savings Trend** — Line chart showing net savings (green) alongside income (indigo dashed) and expenses (red dashed) for easy comparison.
- **Expense Distribution** — Animated progress bars for each spending category, showing both amount and percentage of total expenses.
- **Spending Radar** — Radar chart giving a profile view of how spend is distributed across the top six categories.

---

### Settings

Configuration and data management page.

- **Dark Mode Toggle** — Switches between light and dark theme. Preference is saved to `localStorage` and applied immediately via a class on `<html>`.
- **Role Management** — Radio-style selector to switch between Admin (full access) and Viewer (read-only) roles. Includes a note explaining this is a UI demonstration.
- **Data Overview** — Shows current transaction count, total income and expenses, with buttons to export all data as CSV or JSON.
- **Restore Sample Data** — Reloads the original 60 mock transactions, overwriting any local changes.
- **Clear All Data** — Removes all transactions from local storage (destructive, requires confirmation via button label).
- **About Panel** — Lists the tech stack for quick reference.

---

### Role-Based UI

The role switcher lives in the top-right header and is also accessible in Settings.

| Feature | Admin | Viewer |
|---|---|---|
| View Dashboard | Yes | Yes |
| View Transactions | Yes | Yes |
| Add Transaction | Yes | No |
| Edit Transaction | Yes | No |
| Delete Transaction | Yes | No |
| View Insights | Yes | Yes |
| Export Data | Yes | Yes |
| Change Settings | Yes | Yes |

Role state is persisted to `localStorage` so the selected role survives a page refresh.

---

### Optional Enhancements (all implemented)

| Enhancement | Implementation |
|---|---|
| Dark mode | CSS custom properties + `document.documentElement` class toggle, saved to localStorage |
| Data persistence | All transactions read/written to `localStorage` via `useEffect` |
| Animations / transitions | Framer Motion throughout — staggered card entrances, modal scale, list row animations, sidebar slide |
| Export functionality | CSV and JSON export in Transactions page and Settings page |
| Advanced filtering | Type, category, date range, and text search, all combinable with reset |

---

## Known Limitations

- **No real authentication.** Roles are stored client-side. In a production app, role assignment would be handled server-side via a JWT or session.
- **No pagination.** All matching transactions render at once. A virtualized list would be needed at scale (500+ transactions).
- **Dashboard charts are not filter-aware.** Charts always show aggregate data across all transactions regardless of what filters are active on the Transactions page.
- **localStorage only.** Data does not sync across devices or browser sessions.

---
```
