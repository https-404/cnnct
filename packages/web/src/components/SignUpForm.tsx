import { useState } from "react";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/button";

export function SignUpForm({ onSubmit }: { onSubmit: (data: { email: string; password: string; username: string }) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onSubmit({ email, password, username });
    setLoading(false);
  };

  return (
    <Card className="max-w-sm mx-auto mt-16">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
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
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
    </Card>
  );
}
