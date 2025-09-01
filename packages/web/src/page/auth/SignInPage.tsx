import { SignInForm } from "../../components/SignInForm";

export default function SignInPage() {
  const handleSignIn = (data: { email: string; password: string }) => {
    // TODO: Call login API
    console.log("Sign in:", data);
  };
  return <SignInForm onSubmit={handleSignIn} />;
}
