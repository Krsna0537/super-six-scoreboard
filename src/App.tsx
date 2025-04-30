
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthProvider";
import { NotificationProvider } from "@/contexts/NotificationProvider";
import Index from "./pages/Index";
import Tournaments from "./pages/Tournaments";
import TournamentDetail from "./pages/TournamentDetail";
import Matches from "./pages/Matches";
import LiveScoring from "./pages/LiveScoring";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import Teams from "./pages/Teams";
import Players from "./pages/Players";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/tournaments" element={<Tournaments />} />
                <Route path="/tournaments/:id" element={<TournamentDetail />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/matches/:id/live" element={<LiveScoring />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/players" element={<Players />} />
                
                {/* Admin-only routes */}
                <Route path="/tournaments/create" element={
                  <ProtectedRoute requireAdmin={true}>
                    <div className="container py-8">
                      <h1 className="text-3xl font-bold mb-8">Create Tournament</h1>
                      {/* Tournament creation form will be added here */}
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/teams/create" element={
                  <ProtectedRoute requireAdmin={true}>
                    <div className="container py-8">
                      <h1 className="text-3xl font-bold mb-8">Create Team</h1>
                      {/* Team creation form will be added here */}
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/players/create" element={
                  <ProtectedRoute requireAdmin={true}>
                    <div className="container py-8">
                      <h1 className="text-3xl font-bold mb-8">Create Player</h1>
                      {/* Player creation form will be added here */}
                    </div>
                  </ProtectedRoute>
                } />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
