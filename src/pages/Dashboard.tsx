import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { StatCard } from "../components/ui/StatCard";
import { BalanceTrendChart } from "../components/dashboard/BalanceTrendChart";
import { SpendingBreakdownChart } from "../components/dashboard/SpendingBreakdownChart";
import { MonthlyComparisonChart } from "../components/dashboard/MonthlyComparisonChart";
import { RecentTransactions } from "../components/dashboard/RecentTransactions";
import { getTotals } from "../data/mockData";
import { formatCurrency } from "../lib/utils";

const totals = getTotals();

const stats = [
    {
        title: "Total Balance",
        value: formatCurrency(totals.balance),
        change: 4.2,
        changeLabel: "vs last month",
        icon: <DollarSign className="w-5 h-5 text-white" />,
        gradient: "gradient-balance",
    },
    {
        title: "Total Income",
        value: formatCurrency(totals.income),
        change: 12.5,
        changeLabel: "vs last month",
        icon: <TrendingUp className="w-5 h-5 text-white" />,
        gradient: "gradient-income",
    },
    {
        title: "Total Expenses",
        value: formatCurrency(totals.expenses),
        change: -3.8,
        changeLabel: "vs last month",
        icon: <TrendingDown className="w-5 h-5 text-white" />,
        gradient: "gradient-expense",
    },
    {
        title: "Savings Rate",
        value: `${totals.savingsRate.toFixed(1)}%`,
        change: 2.1,
        changeLabel: "vs last month",
        icon: <PiggyBank className="w-5 h-5 text-white" />,
        gradient: "gradient-primary",
    },
];

export default function Dashboard() {
    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 max-w-7xl mx-auto"
        data-testid="dashboard-page"
        >
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <StatCard key={stat.title} {...stat} index={i} />
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <BalanceTrendChart />
                <SpendingBreakdownChart />
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <MonthlyComparisonChart />
                <RecentTransactions />
            </div>
        </motion.div>
    );
}
