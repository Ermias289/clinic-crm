import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

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

import UsersPage from "./pages/settings/UsersPage";
import UserRolesPage from "./pages/settings/UserRolesPage";
import WorkingDaysPage from "./pages/settings/WorkingDaysPage";
import TestServiceAdd from "./pages/TestServiceAdd";
import NotFound from "./pages/NotFound";
import PaymentTypesPage from "./pages/settings/PaymentTypesPage";
import BankAccountPage from "./pages/settings/BankAccountPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Login page */}
          <Route
            path="/login"
            element={
              localStorage.getItem("token") ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage />
              )
            }
          />

          {/* Protected dashboard / main page */}
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />

          {/* Protected other pages */}
          <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
          <Route path="/cards" element={<ProtectedRoute><CardsPage /></ProtectedRoute>} />
          <Route path="/doctors" element={<ProtectedRoute><DoctorsPage /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute><PatientsPage /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/settings/company" element={<ProtectedRoute><CompanySettingsPage /></ProtectedRoute>} />
          <Route path="/settings/branches" element={<ProtectedRoute><BranchSettingsPage /></ProtectedRoute>} />
          <Route path="/settings/cards" element={<ProtectedRoute><CardSettingsPage /></ProtectedRoute>} />
          <Route path="/settings/card-types" element={<ProtectedRoute><CardTypesPage /></ProtectedRoute>} />
          <Route path="/settings/onboarding" element={<ProtectedRoute><OnboardingSettingsPage /></ProtectedRoute>} />
            <Route path="/settings/payment-types" element={<ProtectedRoute><PaymentTypesPage /></ProtectedRoute>} />   
            <Route path="/settings/bank-account" element={<ProtectedRoute><BankAccountPage /></ProtectedRoute>} />  
          <Route path="/settings/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
          <Route path="/settings/roles" element={<ProtectedRoute><UserRolesPage /></ProtectedRoute>} />
          <Route path="/settings/working-days" element={<ProtectedRoute><WorkingDaysPage /></ProtectedRoute>} />
          <Route path="/test-service" element={<ProtectedRoute><TestServiceAdd /></ProtectedRoute>} />

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
