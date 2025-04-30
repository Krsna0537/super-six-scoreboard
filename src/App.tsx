import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthProvider";
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
import TeamEdit from "./pages/TeamEdit";
import Players from "./pages/Players";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { LiveMatches } from './components/LiveMatches';
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/tournaments" element={<ProtectedRoute><Tournaments /></ProtectedRoute>} />
              <Route path="/tournaments/:id" element={<ProtectedRoute><TournamentDetail /></ProtectedRoute>} />
              <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
              <Route path="/matches/:id/live" element={<ProtectedRoute><LiveScoring /></ProtectedRoute>} />
              <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
              <Route path="/teams/:id/edit" element={<ProtectedRoute><TeamEdit /></ProtectedRoute>} />
              <Route path="/players" element={<ProtectedRoute><Players /></ProtectedRoute>} />
              <Route path="/contact" element={<Contact />} />
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
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
