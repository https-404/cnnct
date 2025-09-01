import { SignUpForm } from "../../components/SignUpForm";

export default function SignUpPage() {
  const handleSignUp = (data: { email: string; password: string; username: string }) => {
    // TODO: Call register API
    console.log("Sign up:", data);
  };
  return <SignUpForm onSubmit={handleSignUp} />;
}
