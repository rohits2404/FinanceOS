import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { getCategoryBreakdown } from "../../data/mockData";
import { formatCurrency } from "../../lib/utils";

const data = getCategoryBreakdown().slice(0, 6);

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const item = payload[0];
        return (
            <div className="bg-card border border-card-border rounded-xl p-3 shadow-lg">
                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">{formatCurrency(item.value)}</p>
                <p className="text-xs text-muted-foreground">{item.payload.percentage.toFixed(1)}%</p>
            </div>
        );
    }
    return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.07) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="600">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export function SpendingBreakdownChart() {
    return (
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-card border border-card-border rounded-2xl p-5"
        data-testid="spending-breakdown-chart"
        >
            <div className="mb-4">
                <h3 className="font-semibold text-foreground">Spending Breakdown</h3>
                <p className="text-xs text-muted-foreground mt-0.5">By category</p>
            </div>
            <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={90}
                        innerRadius={40}
                        dataKey="amount"
                        paddingAngle={2}
                        animationBegin={0}
                        animationDuration={800}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
                {data.slice(0, 6).map((item) => (
                    <div key={item.category} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-muted-foreground truncate">{item.name}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
