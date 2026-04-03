import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { getBalanceTrend } from "../../data/mockData";
import { formatCurrency } from "../../lib/utils";

const trendData = getBalanceTrend().filter((_, i, arr) => {
    const step = Math.max(1, Math.floor(arr.length / 30));
    return i % step === 0;
});

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card border border-card-border rounded-xl p-3 shadow-lg">
                <p className="text-xs text-muted-foreground mb-1">
                    {new Date(label).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
                <p className="text-sm font-bold text-foreground">
                    {formatCurrency(payload[0].value)}
                </p>
            </div>
        );
    }
    return null;
};

export function BalanceTrendChart() {
  
    const startBalance = trendData[0]?.balance ?? 0;
  
    const endBalance = trendData[trendData.length - 1]?.balance ?? 0;
  
    const isPositive = endBalance >= startBalance;

    return (
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-card border border-card-border rounded-2xl p-5 col-span-2"
        data-testid="balance-trend-chart"
        >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                <div>
                    <h3 className="font-semibold text-foreground">Balance Trend</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Running balance over time</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(endBalance)}</p>
                    <p className={`text-xs font-medium ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                        {isPositive ? "+" : ""}{formatCurrency(endBalance - startBalance)} since Jan
                    </p>
                </div>
            </div>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                        <defs>
                            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={isPositive ? "#6366f1" : "#ef4444"} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={isPositive ? "#6366f1" : "#ef4444"} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                        <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) =>
                            new Date(val).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        }
                        interval={Math.floor(trendData.length / 5)}
                        />
                        <YAxis
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                        width={45}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={startBalance} stroke="hsl(var(--border))" strokeDasharray="4 4" />
                        <Area
                        type="monotone"
                        dataKey="balance"
                        stroke={isPositive ? "#6366f1" : "#ef4444"}
                        strokeWidth={2.5}
                        fill="url(#balanceGradient)"
                        dot={false}
                        activeDot={{ r: 5, fill: isPositive ? "#6366f1" : "#ef4444", strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
