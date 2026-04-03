import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { type Transaction, mockTransactions } from "../data/mockData";

export type Role = "admin" | "viewer";
export type Theme = "light" | "dark";

export interface Filters {
    search: string;
    type: "all" | "income" | "expense";
    category: string;
    dateFrom: string;
    dateTo: string;
    sortBy: "date" | "amount" | "description";
    sortOrder: "asc" | "desc";
}

interface AppContextType {
    role: Role;
    setRole: (role: Role) => void;
    theme: Theme;
    toggleTheme: () => void;
    transactions: Transaction[];
    addTransaction: (tx: Omit<Transaction, "id">) => void;
    updateTransaction: (tx: Transaction) => void;
    deleteTransaction: (id: string) => void;
    filters: Filters;
    setFilters: (filters: Partial<Filters>) => void;
    filteredTransactions: Transaction[];
    resetFilters: () => void;
}

const defaultFilters: Filters = {
    search: "",
    type: "all",
    category: "all",
    dateFrom: "",
    dateTo: "",
    sortBy: "date",
    sortOrder: "desc",
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [role, setRoleState] = useState<Role>(() => {
        try {
            return (localStorage.getItem("fd_role") as Role) || "admin";
        } catch {
            return "admin";
        }
    });

    const [theme, setTheme] = useState<Theme>(() => {
        try {
            return (localStorage.getItem("fd_theme") as Theme) || "light";
        } catch {
            return "light";
        }
    });

    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        try {
            const stored = localStorage.getItem("fd_transactions");
            return stored ? JSON.parse(stored) : mockTransactions;
        } catch {
            return mockTransactions;
        }
    });

    const [filters, setFiltersState] = useState<Filters>(defaultFilters);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("fd_theme", theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem("fd_role", role);
    }, [role]);

    useEffect(() => {
        localStorage.setItem("fd_transactions", JSON.stringify(transactions));
    }, [transactions]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    }, []);

    const setRole = useCallback((r: Role) => {
        setRoleState(r);
    }, []);

    const addTransaction = useCallback((tx: Omit<Transaction, "id">) => {
        const newTx: Transaction = {
            ...tx,
            id: `t_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        };
        setTransactions((prev) => [newTx, ...prev]);
    }, []);

    const updateTransaction = useCallback((tx: Transaction) => {
        setTransactions((prev) => prev.map((t) => (t.id === tx.id ? tx : t)));
    }, []);

    const deleteTransaction = useCallback((id: string) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const setFilters = useCallback((partial: Partial<Filters>) => {
        setFiltersState((prev) => ({ ...prev, ...partial }));
    }, []);

    const resetFilters = useCallback(() => {
        setFiltersState(defaultFilters);
    }, []);

    const filteredTransactions = (() => {
        let result = [...transactions];

        if (filters.search) {
            const q = filters.search.toLowerCase();
            result = result.filter((t) =>
                t.description.toLowerCase().includes(q) ||
                t.merchant?.toLowerCase().includes(q) ||
                t.category.toLowerCase().includes(q)
            );
        }

        if (filters.type !== "all") {
            result = result.filter((t) => t.type === filters.type);
        }

        if (filters.category && filters.category !== "all") {
            result = result.filter((t) => t.category === filters.category);
        }

        if (filters.dateFrom) {
            result = result.filter((t) => t.date >= filters.dateFrom);
        }

        if (filters.dateTo) {
            result = result.filter((t) => t.date <= filters.dateTo);
        }

        result.sort((a, b) => {
            let comparison = 0;
            if (filters.sortBy === "date") {
                comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            } else if (filters.sortBy === "amount") {
                comparison = a.amount - b.amount;
            } else if (filters.sortBy === "description") {
                comparison = a.description.localeCompare(b.description);
            }
            return filters.sortOrder === "asc" ? comparison : -comparison;
        });

        return result;
    })();

    return (
        <AppContext.Provider
        value={{
            role,
            setRole,
            theme,
            toggleTheme,
            transactions,
            addTransaction,
            updateTransaction,
            deleteTransaction,
            filters,
            setFilters,
            filteredTransactions,
            resetFilters,
        }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useApp must be used within AppProvider");
    return ctx;
}
