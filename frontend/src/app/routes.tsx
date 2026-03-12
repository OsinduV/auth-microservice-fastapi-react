import { Routes, Route } from "react-router-dom";
import Layout from "../app/Layout";

// Core pages
import Home from "../modules/core/pages/Home";
import About from "../modules/core/pages/About";
import Contact from "../modules/core/pages/Contact";
import NotFound from "../modules/core/pages/NotFound";

// Valuation Service
import ValuationDashboard from "../modules/valuation/pages/ValuationDashboard";

// Sentiment Chatbot
import SentimentDashboard from "../modules/sentiment/pages/SentimentDashboard";

// Fraud Detection
import FraudDashboard from "../modules/fraud/pages/FraudDashboard";

// Recommendations
import RecommendationDashboard from "../modules/recommendation/pages/RecommendationDashboard";

// Auth module
import LoginPage from "../modules/auth/pages/LoginPage";
import RegisterPage from "../modules/auth/pages/RegisterPage";
import ProtectedRoute from "../modules/auth/components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth pages — use their own full-page layout, no Navbar/Footer */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Main application shell */}
      <Route element={<Layout />}>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected routes — redirect to /login when not authenticated */}
        <Route element={<ProtectedRoute />}>
          <Route path="/valuation" element={<ValuationDashboard />} />
          <Route path="/sentiment" element={<SentimentDashboard />} />
          <Route path="/fraud-detection" element={<FraudDashboard />} />
          <Route path="/recommendations" element={<RecommendationDashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
