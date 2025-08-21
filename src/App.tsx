import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { queryClient } from "@/lib/queryClient";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppLayout } from "@/components/layout/AppLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import NotFound from "./pages/NotFound";

// Initialize MSW in development
if (import.meta.env.DEV) {
  import('./mocks/browser').then(({ worker }) => {
    worker.start();
  });
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route path="/auth/sign-up" element={<SignUp />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <AuthGuard>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </AuthGuard>
          } />
          
          <Route path="/transactions" element={
            <AuthGuard>
              <AppLayout>
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold">Transactions</h2>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              </AppLayout>
            </AuthGuard>
          } />
          
          <Route path="/accounts" element={
            <AuthGuard>
              <AppLayout>
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold">Accounts</h2>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              </AppLayout>
            </AuthGuard>
          } />
          
          <Route path="/categories" element={
            <AuthGuard>
              <AppLayout>
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold">Categories</h2>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              </AppLayout>
            </AuthGuard>
          } />
          
          <Route path="/budgets" element={
            <AuthGuard>
              <AppLayout>
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold">Budgets</h2>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              </AppLayout>
            </AuthGuard>
          } />
          
          <Route path="/goals" element={
            <AuthGuard>
              <AppLayout>
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold">Goals</h2>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              </AppLayout>
            </AuthGuard>
          } />
          
          <Route path="/recurring" element={
            <AuthGuard>
              <AppLayout>
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold">Recurring</h2>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              </AppLayout>
            </AuthGuard>
          } />
          
          <Route path="/reports" element={
            <AuthGuard>
              <AppLayout>
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold">Reports</h2>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              </AppLayout>
            </AuthGuard>
          } />
          
          <Route path="/settings" element={
            <AuthGuard>
              <AppLayout>
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold">Settings</h2>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              </AppLayout>
            </AuthGuard>
          } />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/index" element={<Navigate to="/dashboard" replace />} />
          
          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
