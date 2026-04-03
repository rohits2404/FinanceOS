import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./context/AppContext";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient();

function Router() {
    return (
        <Layout>
            <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/transactions" component={Transactions} />
                <Route path="/insights" component={Insights} />
                <Route path="/settings" component={Settings} />
                <Route component={NotFound} />
            </Switch>
        </Layout>
    )
}

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AppProvider>
                <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                    <Router/>
                </WouterRouter>
            </AppProvider>
        </QueryClientProvider>
    )
}

export default App
