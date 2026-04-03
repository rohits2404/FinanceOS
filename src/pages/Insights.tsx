import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  LineChart,
  Line,
  Legend,
} from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { useApp } from "../context/AppContext";
import {
  getCategoryBreakdown,
  getMonthlyData,
  categoryConfig,
  type TransactionCategory,
} from "../data/mockData";
import { formatCurrency, cn } from "../lib/utils";
import { TrendingUp, TrendingDown, Award, AlertCircle, Target } from "lucide-react";

const categoryBreakdown = getCategoryBreakdown();

const monthlyData = getMonthlyData();

const formatter = (value: ValueType | undefined, name: NameType | undefined) => [
    formatCurrency(Number(value ?? 0)),
    String(name ?? "").charAt(0).toUpperCase() + String(name ?? "").slice(1),
];

const CustomTooltipBar = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card border border-card-border rounded-xl p-3 shadow-lg">
                <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
                <p className="text-sm text-muted-foreground">{formatCurrency(payload[0].value)}</p>
            </div>
        );
    }
    return null;
};

export default function Insights() {

    const { transactions } = useApp();

    const incomeTransactions = transactions.filter((t) => t.type === "income");
    const expenseTransactions = transactions.filter((t) => t.type === "expense");

    const totalIncome = incomeTransactions.reduce((s, t) => s + t.amount, 0);
    const totalExpenses = expenseTransactions.reduce((s, t) => s + t.amount, 0);
    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    const topCategory = categoryBreakdown[0];
    const lowestMonth = [...monthlyData].sort((a, b) => (a.income - a.expenses) - (b.income - b.expenses))[0];
    const bestMonth = [...monthlyData].sort((a, b) => (b.income - b.expenses) - (a.income - a.expenses))[0];

    const avgMonthlyExpense = totalExpenses / 4;
    const avgMonthlyIncome = totalIncome / 4;

    // Spending by category for bar chart (top 8)
    const spendingData = categoryBreakdown.slice(0, 8).map((c) => ({
        name: c.name.length > 12 ? c.name.slice(0, 12) + "…" : c.name,
        amount: c.amount,
        color: c.color,
    }));

    // Radar data for spending profile
    const radarData = categoryBreakdown.slice(0, 6).map((c) => ({
        category: c.name.split(" ")[0],
        amount: Math.round(c.amount),
    }));

    // Monthly trend - savings
    const savingsTrendData = monthlyData.map((m) => ({
        month: m.month,
        savings: m.income - m.expenses,
        income: m.income,
        expenses: m.expenses,
    }));

    const insights = [
        {
            icon: <Award className="w-5 h-5 text-amber-500" />,
            bg: "bg-amber-100 dark:bg-amber-900/20",
            title: "Top Spending Category",
            value: topCategory ? categoryConfig[topCategory.category as TransactionCategory].label : "—",
            detail: topCategory ? `${formatCurrency(topCategory.amount)} (${topCategory.percentage.toFixed(1)}% of expenses)` : "",
            type: "neutral" as const,
        },
        {
            icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
            bg: "bg-emerald-100 dark:bg-emerald-900/20",
            title: "Best Month",
            value: bestMonth?.month || "—",
            detail: `Saved ${formatCurrency(bestMonth?.income - bestMonth?.expenses || 0)}`,
            type: "positive" as const,
        },
        {
            icon: <TrendingDown className="w-5 h-5 text-red-500" />,
            bg: "bg-red-100 dark:bg-red-900/20",
            title: "Tightest Month",
            value: lowestMonth?.month || "—",
            detail: `Only saved ${formatCurrency(lowestMonth?.income - lowestMonth?.expenses || 0)}`,
            type: "negative" as const,
        },
        {
            icon: <Target className="w-5 h-5 text-indigo-500" />,
            bg: "bg-indigo-100 dark:bg-indigo-900/20",
            title: "Savings Rate",
            value: `${savingsRate.toFixed(1)}%`,
            detail: savingsRate >= 20 ? "Excellent! Above 20% target" : "Aim for 20%+ savings rate",
            type: savingsRate >= 20 ? ("positive" as const) : ("negative" as const),
        },
        {
            icon: <AlertCircle className="w-5 h-5 text-orange-500" />,
            bg: "bg-orange-100 dark:bg-orange-900/20",
            title: "Avg Monthly Expenses",
            value: formatCurrency(avgMonthlyExpense),
            detail: `vs ${formatCurrency(avgMonthlyIncome)} avg income`,
            type: "neutral" as const,
        },
    ];

    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 max-w-7xl mx-auto"
        data-testid="insights-page"
        >
            {/* Key Insights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {insights.map((insight, i) => (
                    <motion.div
                    key={insight.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-card border border-card-border rounded-2xl p-4"
                    data-testid={`insight-card-${i}`}
                    >
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", insight.bg)}>
                            {insight.icon}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{insight.title}</p>
                        <p className="text-base font-bold text-foreground">{insight.value}</p>
                        <p className={cn("text-xs mt-0.5",
                            insight.type === "positive" ? "text-emerald-600 dark:text-emerald-400" :
                            insight.type === "negative" ? "text-red-500" : "text-muted-foreground"
                        )}>
                            {insight.detail}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Category Spending Bar */}
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card border border-card-border rounded-2xl p-5"
                data-testid="category-bar-chart"
                >
                    <h3 className="font-semibold text-foreground mb-1">Spending by Category</h3>
                    <p className="text-xs text-muted-foreground mb-4">Total across all months</p>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={spendingData} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} horizontal={false} />
                                <XAxis
                                type="number"
                                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                                />
                                <YAxis
                                type="category"
                                dataKey="name"
                                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                                tickLine={false}
                                axisLine={false}
                                width={80}
                                />
                                <Tooltip content={<CustomTooltipBar />} />
                                <Bar dataKey="amount" radius={[0, 4, 4, 0]} fill="#6366f1" maxBarSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Savings Trend */}
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card border border-card-border rounded-2xl p-5"
                data-testid="savings-trend-chart"
                >
                    <h3 className="font-semibold text-foreground mb-1">Monthly Savings Trend</h3>
                    <p className="text-xs text-muted-foreground mb-4">Income - Expenses each month</p>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={savingsTrendData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={45} />
                                <Tooltip
                                formatter={formatter}
                                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }}
                                />
                                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", textTransform: "capitalize" }}>{v}</span>} />
                                <Line type="monotone" dataKey="savings" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 4, fill: "#22c55e", strokeWidth: 0 }} activeDot={{ r: 6 }} name="savings" />
                                <Line type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="income" />
                                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="expenses" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Category progress bars */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-card border border-card-border rounded-2xl p-5"
                data-testid="category-progress"
            >
                <h3 className="font-semibold text-foreground mb-1">Expense Distribution</h3>
                <p className="text-xs text-muted-foreground mb-5">How your spending is allocated</p>
                <div className="space-y-3">
                    {categoryBreakdown.slice(0, 8).map((item, i) => (
                        <motion.div
                        key={item.category}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.05 }}
                        data-testid={`category-bar-${item.category}`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-foreground">{item.name}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-muted-foreground">{formatCurrency(item.amount)}</span>
                                    <span className="text-xs font-medium text-muted-foreground w-10 text-right">
                                        {item.percentage.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.percentage}%` }}
                                transition={{ delay: 0.6 + i * 0.05, duration: 0.6, ease: "easeOut" }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: item.color }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Radar Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-card border border-card-border rounded-2xl p-5"
                data-testid="spending-radar"
            >
                <h3 className="font-semibold text-foreground mb-1">Spending Profile</h3>
                <p className="text-xs text-muted-foreground mb-4">Radar view of top spending categories</p>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="hsl(var(--border))" />
                            <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                            <Radar name="Spending" dataKey="amount" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </motion.div>
    );
}
