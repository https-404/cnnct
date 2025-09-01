import { SignInForm } from "../../components/SignInForm";
import { useThemeEffect } from "../../feature/theme/useThemeEffect";

export default function SignInPage() {
  // Apply the theme
  useThemeEffect();
  
  const handleSignIn = (data: { email: string; password: string }) => {
    // TODO: Call login API
    console.log("Sign in:", data);
  };
  
  return <SignInForm onSubmit={handleSignIn} />;
}
