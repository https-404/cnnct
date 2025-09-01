import { SignUpForm } from "../../components/SignUpForm";
import { useThemeEffect } from "../../feature/theme/useThemeEffect";

export default function SignUpPage() {
  // Apply the theme
  useThemeEffect();
  
  const handleSignUp = (data: { email: string; password: string; username: string }) => {
    // TODO: Call register API
    console.log("Sign up:", data);
  };
  
  return <SignUpForm onSubmit={handleSignUp} />;
}
