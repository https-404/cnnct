import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SignUpForm } from "../../components/SignUpForm";
import { useThemeEffect } from "../../feature/theme/useThemeEffect";
import { authService } from "../../services/api/auth.service";
import { setCredentials } from "../../feature/auth/auth.slice";
import { setAccessToken, setRefreshToken } from "../../services/token";

export default function SignUpPage() {
  // Apply the theme
  useThemeEffect();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (data: { email: string; password: string; username: string }) => {
    try {
      setError(null);
      const response = await authService.register(data);
      
      // Store tokens
      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      
      // Update Redux state
      dispatch(setCredentials({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      }));
      
      // Navigate to home
      navigate("/home");
    } catch (err: any) {
      setError(err.message || "Failed to sign up. Please try again.");
      console.error("Sign up error:", err);
    }
  };
  
  return (
    <>
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
          {error}
        </div>
      )}
      <SignUpForm onSubmit={handleSignUp} />
    </>
  );
}
