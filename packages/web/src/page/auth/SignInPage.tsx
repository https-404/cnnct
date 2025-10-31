import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SignInForm } from "../../components/SignInForm";
import { useThemeEffect } from "../../feature/theme/useThemeEffect";
import { authService } from "../../services/api/auth.service";
import { setCredentials } from "../../feature/auth/auth.slice";
import { setAccessToken, setRefreshToken } from "../../services/token";

export default function SignInPage() {
  // Apply the theme
  useThemeEffect();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (data: { email: string; password: string }) => {
    try {
      setError(null);
      const response = await authService.login(data);
      
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
      setError(err.message || "Failed to sign in. Please check your credentials.");
      console.error("Sign in error:", err);
    }
  };
  
  return (
    <>
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
          {error}
        </div>
      )}
      <SignInForm onSubmit={handleSignIn} />
    </>
  );
}
