import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import CardsPage from "./pages/CardsPage";
import DoctorsPage from "./pages/DoctorsPage";
import ServicesPage from "./pages/ServicesPage";
import PatientsPage from "./pages/PatientsPage";
import PaymentsPage from "./pages/PaymentsPage";
import SettingsPage from "./pages/SettingsPage";
import CompanySettingsPage from "./pages/settings/CompanySettingsPage";
import BranchSettingsPage from "./pages/settings/BranchSettingsPage";
import CardSettingsPage from "./pages/settings/CardSettingsPage";
import CardTypesPage from "./pages/settings/CardTypesPage";
import OnboardingSettingsPage from "./pages/settings/OnboardingSettingsPage";
import WorkingDaysPage from "./pages/settings/WorkingDaysPage";
import UsersPage from "./pages/settings/UsersPage";
import UserRolesPage from "./pages/settings/UserRolesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Index />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/company" element={<CompanySettingsPage />} />
          <Route path="/settings/branches" element={<BranchSettingsPage />} />
          <Route path="/settings/cards" element={<CardSettingsPage />} />
          <Route path="/settings/card-types" element={<CardTypesPage />} />
          <Route path="/settings/onboarding" element={<OnboardingSettingsPage />} />
          <Route path="/settings/working-days" element={<WorkingDaysPage />} />
          <Route path="/settings/users" element={<UsersPage />} />
          <Route path="/settings/roles" element={<UserRolesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
