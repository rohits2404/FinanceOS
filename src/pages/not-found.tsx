import { motion } from "framer-motion";
import { Link } from "wouter";
import { Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
                <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
                <Link href="/">
                    <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors cursor-pointer">
                        <Home className="w-4 h-4" />
                        Back to Dashboard
                    </span>
                </Link>
            </motion.div>
        </div>
    );
}
