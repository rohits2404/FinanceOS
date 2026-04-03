export type TransactionType = "income" | "expense";

export type TransactionCategory =
  | "salary"
  | "freelance"
  | "investment"
  | "food"
  | "transport"
  | "utilities"
  | "entertainment"
  | "shopping"
  | "health"
  | "education"
  | "housing"
  | "travel"
  | "subscription"
  | "other";

export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    category: TransactionCategory;
    type: TransactionType;
    merchant?: string;
    notes?: string;
}

export const categoryConfig: Record<
    TransactionCategory,
    { label: string; color: string; bgColor: string; darkBg: string }
> = {
    salary: { label: "Salary", color: "#6366f1", bgColor: "bg-indigo-100", darkBg: "bg-indigo-900/30" },
    freelance: { label: "Freelance", color: "#8b5cf6", bgColor: "bg-purple-100", darkBg: "bg-purple-900/30" },
    investment: { label: "Investment", color: "#0ea5e9", bgColor: "bg-sky-100", darkBg: "bg-sky-900/30" },
    food: { label: "Food & Dining", color: "#f59e0b", bgColor: "bg-amber-100", darkBg: "bg-amber-900/30" },
    transport: { label: "Transport", color: "#06b6d4", bgColor: "bg-cyan-100", darkBg: "bg-cyan-900/30" },
    utilities: { label: "Utilities", color: "#64748b", bgColor: "bg-slate-100", darkBg: "bg-slate-900/30" },
    entertainment: { label: "Entertainment", color: "#ec4899", bgColor: "bg-pink-100", darkBg: "bg-pink-900/30" },
    shopping: { label: "Shopping", color: "#f97316", bgColor: "bg-orange-100", darkBg: "bg-orange-900/30" },
    health: { label: "Health", color: "#22c55e", bgColor: "bg-green-100", darkBg: "bg-green-900/30" },
    education: { label: "Education", color: "#3b82f6", bgColor: "bg-blue-100", darkBg: "bg-blue-900/30" },
    housing: { label: "Housing", color: "#a855f7", bgColor: "bg-purple-100", darkBg: "bg-purple-900/30" },
    travel: { label: "Travel", color: "#14b8a6", bgColor: "bg-teal-100", darkBg: "bg-teal-900/30" },
    subscription: { label: "Subscriptions", color: "#6366f1", bgColor: "bg-indigo-100", darkBg: "bg-indigo-900/30" },
    other: { label: "Other", color: "#94a3b8", bgColor: "bg-slate-100", darkBg: "bg-slate-900/30" },
};

export const mockTransactions: Transaction[] = [
    // January 2025
    { id: "t1", date: "2025-01-02", description: "Monthly Salary", amount: 7500, category: "salary", type: "income", merchant: "TechCorp Inc." },
    { id: "t2", date: "2025-01-03", description: "Rent Payment", amount: 1800, category: "housing", type: "expense", merchant: "Sunset Apartments" },
    { id: "t3", date: "2025-01-05", description: "Grocery Shopping", amount: 145.50, category: "food", type: "expense", merchant: "Whole Foods" },
    { id: "t4", date: "2025-01-07", description: "Netflix Subscription", amount: 15.99, category: "subscription", type: "expense", merchant: "Netflix" },
    { id: "t5", date: "2025-01-08", description: "Spotify Premium", amount: 9.99, category: "subscription", type: "expense", merchant: "Spotify" },
    { id: "t6", date: "2025-01-10", description: "Freelance Project - Web Design", amount: 1200, category: "freelance", type: "income", merchant: "Client: StartupXYZ" },
    { id: "t7", date: "2025-01-12", description: "Electricity Bill", amount: 87.40, category: "utilities", type: "expense", merchant: "City Power" },
    { id: "t8", date: "2025-01-14", description: "Gym Membership", amount: 45, category: "health", type: "expense", merchant: "FitLife Gym" },
    { id: "t9", date: "2025-01-15", description: "Restaurant Dinner", amount: 78.60, category: "food", type: "expense", merchant: "The Olive Garden" },
    { id: "t10", date: "2025-01-18", description: "Uber Rides", amount: 34.20, category: "transport", type: "expense", merchant: "Uber" },
    { id: "t11", date: "2025-01-20", description: "Online Course - React", amount: 59.99, category: "education", type: "expense", merchant: "Udemy" },
    { id: "t12", date: "2025-01-22", description: "Stock Dividend", amount: 230, category: "investment", type: "income", merchant: "Fidelity Investments" },
    { id: "t13", date: "2025-01-25", description: "Amazon Shopping", amount: 124.35, category: "shopping", type: "expense", merchant: "Amazon" },
    { id: "t14", date: "2025-01-28", description: "Doctor Visit Copay", amount: 30, category: "health", type: "expense", merchant: "City Medical Center" },
    { id: "t15", date: "2025-01-30", description: "Movie Night", amount: 28.50, category: "entertainment", type: "expense", merchant: "AMC Theaters" },

    // February 2025
    { id: "t16", date: "2025-02-01", description: "Monthly Salary", amount: 7500, category: "salary", type: "income", merchant: "TechCorp Inc." },
    { id: "t17", date: "2025-02-02", description: "Rent Payment", amount: 1800, category: "housing", type: "expense", merchant: "Sunset Apartments" },
    { id: "t18", date: "2025-02-04", description: "Grocery Shopping", amount: 162.30, category: "food", type: "expense", merchant: "Trader Joe's" },
    { id: "t19", date: "2025-02-06", description: "Valentine's Day Dinner", amount: 156.80, category: "food", type: "expense", merchant: "Fine Dining Co." },
    { id: "t20", date: "2025-02-08", description: "Netflix Subscription", amount: 15.99, category: "subscription", type: "expense", merchant: "Netflix" },
    { id: "t21", date: "2025-02-10", description: "Freelance Project - Mobile App", amount: 2400, category: "freelance", type: "income", merchant: "Client: MobileFirst" },
    { id: "t22", date: "2025-02-12", description: "Internet Bill", amount: 65, category: "utilities", type: "expense", merchant: "FiberNet" },
    { id: "t23", date: "2025-02-14", description: "Flowers & Gifts", amount: 85.50, category: "shopping", type: "expense", merchant: "1-800-Flowers" },
    { id: "t24", date: "2025-02-15", description: "Spotify Premium", amount: 9.99, category: "subscription", type: "expense", merchant: "Spotify" },
    { id: "t25", date: "2025-02-18", description: "Pharmacy", amount: 42.15, category: "health", type: "expense", merchant: "CVS Pharmacy" },
    { id: "t26", date: "2025-02-20", description: "Coffee Shops", amount: 48.75, category: "food", type: "expense", merchant: "Starbucks" },
    { id: "t27", date: "2025-02-22", description: "Investment Return", amount: 385, category: "investment", type: "income", merchant: "Robinhood" },
    { id: "t28", date: "2025-02-25", description: "Clothing Purchase", amount: 210.40, category: "shopping", type: "expense", merchant: "Zara" },
    { id: "t29", date: "2025-02-26", description: "Public Transit Pass", amount: 95, category: "transport", type: "expense", merchant: "Metro System" },
    { id: "t30", date: "2025-02-28", description: "Streaming Bundle", amount: 19.99, category: "subscription", type: "expense", merchant: "Disney+ Bundle" },

    // March 2025
    { id: "t31", date: "2025-03-01", description: "Monthly Salary", amount: 7500, category: "salary", type: "income", merchant: "TechCorp Inc." },
    { id: "t32", date: "2025-03-02", description: "Rent Payment", amount: 1800, category: "housing", type: "expense", merchant: "Sunset Apartments" },
    { id: "t33", date: "2025-03-04", description: "Grocery Shopping", amount: 178.90, category: "food", type: "expense", merchant: "Whole Foods" },
    { id: "t34", date: "2025-03-06", description: "Spring Clothing Haul", amount: 340.20, category: "shopping", type: "expense", merchant: "H&M" },
    { id: "t35", date: "2025-03-08", description: "Netflix Subscription", amount: 15.99, category: "subscription", type: "expense", merchant: "Netflix" },
    { id: "t36", date: "2025-03-10", description: "Side Project Income", amount: 850, category: "freelance", type: "income", merchant: "Fiverr" },
    { id: "t37", date: "2025-03-12", description: "Gas Bill", amount: 74.60, category: "utilities", type: "expense", merchant: "City Gas" },
    { id: "t38", date: "2025-03-14", description: "Dentist Appointment", amount: 180, category: "health", type: "expense", merchant: "Smile Dental" },
    { id: "t39", date: "2025-03-15", description: "Spotify Premium", amount: 9.99, category: "subscription", type: "expense", merchant: "Spotify" },
    { id: "t40", date: "2025-03-17", description: "Weekend Trip - Flight", amount: 320, category: "travel", type: "expense", merchant: "Delta Airlines" },
    { id: "t41", date: "2025-03-18", description: "Hotel - Weekend Trip", amount: 240, category: "travel", type: "expense", merchant: "Marriott" },
    { id: "t42", date: "2025-03-20", description: "Investment Dividend", amount: 155, category: "investment", type: "income", merchant: "Vanguard" },
    { id: "t43", date: "2025-03-22", description: "Restaurant Lunch", amount: 52.40, category: "food", type: "expense", merchant: "Chipotle" },
    { id: "t44", date: "2025-03-25", description: "Books Purchase", amount: 67.80, category: "education", type: "expense", merchant: "Amazon Books" },
    { id: "t45", date: "2025-03-28", description: "Concert Tickets", amount: 145, category: "entertainment", type: "expense", merchant: "Ticketmaster" },

    // April 2025
    { id: "t46", date: "2025-04-01", description: "Monthly Salary", amount: 7800, category: "salary", type: "income", merchant: "TechCorp Inc.", notes: "April raise" },
    { id: "t47", date: "2025-04-02", description: "Rent Payment", amount: 1800, category: "housing", type: "expense", merchant: "Sunset Apartments" },
    { id: "t48", date: "2025-04-04", description: "Grocery Shopping", amount: 134.60, category: "food", type: "expense", merchant: "Trader Joe's" },
    { id: "t49", date: "2025-04-06", description: "Freelance - Dashboard Design", amount: 1800, category: "freelance", type: "income", merchant: "Client: FinTech Co." },
    { id: "t50", date: "2025-04-08", description: "Netflix Subscription", amount: 15.99, category: "subscription", type: "expense", merchant: "Netflix" },
    { id: "t51", date: "2025-04-09", description: "Electricity Bill", amount: 92.30, category: "utilities", type: "expense", merchant: "City Power" },
    { id: "t52", date: "2025-04-10", description: "Lunch with Friends", amount: 68.40, category: "food", type: "expense", merchant: "Yard House" },
    { id: "t53", date: "2025-04-12", description: "Apple Subscription", amount: 14.99, category: "subscription", type: "expense", merchant: "Apple" },
    { id: "t54", date: "2025-04-15", description: "Spotify Premium", amount: 9.99, category: "subscription", type: "expense", merchant: "Spotify" },
    { id: "t55", date: "2025-04-17", description: "Investment Gains", amount: 520, category: "investment", type: "income", merchant: "Schwab" },
    { id: "t56", date: "2025-04-19", description: "Gym Equipment", amount: 189.99, category: "health", type: "expense", merchant: "Dick's Sporting Goods" },
    { id: "t57", date: "2025-04-20", description: "Online Shopping", amount: 98.75, category: "shopping", type: "expense", merchant: "eBay" },
    { id: "t58", date: "2025-04-22", description: "Car Insurance", amount: 145, category: "utilities", type: "expense", merchant: "Geico" },
    { id: "t59", date: "2025-04-24", description: "Taxi to Airport", amount: 38.50, category: "transport", type: "expense", merchant: "Lyft" },
    { id: "t60", date: "2025-04-28", description: "Fine Dining", amount: 178.60, category: "food", type: "expense", merchant: "Le Bernardin" },
];

export const getMonthlyData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr"];
    const monthKeys = ["2025-01", "2025-02", "2025-03", "2025-04"];

    return months.map((month, i) => {
        const monthTransactions = mockTransactions.filter((t) =>
            t.date.startsWith(monthKeys[i])
        );
        const income = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
        const expenses = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
        return { month, income, expenses, balance: income - expenses };
    });
};

export const getCategoryBreakdown = () => {
    const expenseTransactions = mockTransactions.filter((t) => t.type === "expense");
    const categoryTotals: Record<string, number> = {};

    expenseTransactions.forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    return Object.entries(categoryTotals)
    .map(([category, amount]) => ({
        category: category as TransactionCategory,
        name: categoryConfig[category as TransactionCategory].label,
        amount,
        color: categoryConfig[category as TransactionCategory].color,
        percentage: 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .map((item, _, arr) => {
        const total = arr.reduce((sum, i) => sum + i.amount, 0);
        return { ...item, percentage: (item.amount / total) * 100 };
    });
};

export const getBalanceTrend = () => {
    let runningBalance = 12000;
    const trend: { date: string; balance: number }[] = [];

    const sorted = [...mockTransactions].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    sorted.forEach((t) => {
        runningBalance += t.type === "income" ? t.amount : -t.amount;
        trend.push({ date: t.date, balance: Math.round(runningBalance * 100) / 100 });
    });

    return trend;
};

export const getTotals = () => {
    const income = mockTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
    const expenses = mockTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
    const balance = 12000 + income - expenses;
    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    return { income, expenses, balance, savings, savingsRate };
};
