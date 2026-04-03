import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { getMonthlyData } from "../../data/mockData";
import { formatCurrency } from "../../lib/utils";

const data = getMonthlyData();

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card border border-card-border rounded-xl p-3 shadow-lg min-w-35">
                <p className="text-xs font-semibold text-foreground mb-2">{label}</p>
                {payload.map((p: any) => (
                    <div key={p.dataKey} className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.fill }} />
                            <span className="text-muted-foreground capitalize">{p.dataKey}</span>
                        </div>
                        <span className="font-medium text-foreground">{formatCurrency(p.value)}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export function MonthlyComparisonChart() {
    return (
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-card border border-card-border rounded-2xl p-5 col-span-2"
        data-testid="monthly-comparison-chart"
        >
            <div className="mb-4">
                <h3 className="font-semibold text-foreground">Monthly Overview</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Income vs Expenses comparison</p>
            </div>
            <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                        <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        tickLine={false}
                        axisLine={false}
                        />
                        <YAxis
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                        width={45}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => (
                            <span style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", textTransform: "capitalize" }}>
                            {value}
                            </span>
                        )}
                        />
                        <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        <Bar dataKey="expenses" name="Expenses" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
