import { useState } from "react";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/button";

export function SignInForm({ onSubmit }: { onSubmit: (data: { email: string; password: string }) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onSubmit({ email, password });
    setLoading(false);
  };

  return (
    <Card className="max-w-sm mx-auto mt-16">
      <h2 className="text-xl font-bold mb-4">Sign In</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </Card>
  );
}
