import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MarketingPage from "./page/MarketingPage";
import HomePage from "./page/HomePage";
import SignInPage from "./page/auth/SignInPage";
import SignUpPage from "./page/auth/SignUpPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/auth/SignInPage" element={<SignInPage />} />
        <Route path="/auth/SignUpPage" element={<SignUpPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
