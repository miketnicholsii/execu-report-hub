import { useState, useEffect } from "react";
import { Lock } from "lucide-react";

const SITE_PASSWORD = "cfs2026";
const STORAGE_KEY = "cfs-auth";

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") setAuthed(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === SITE_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setAuthed(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  if (authed) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 p-8 bg-card rounded-xl border border-border shadow-lg">
        <div className="flex flex-col items-center gap-2">
          <Lock className="h-8 w-8 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">NÈKO</h1>
          <p className="text-sm text-muted-foreground">Mike Nichols — Project Intelligence</p>
        </div>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Password"
          autoFocus
          className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
            error ? "border-red-500 ring-2 ring-red-500/30" : "border-border"
          }`}
        />
        {error && <p className="text-xs text-red-500 text-center">Incorrect password</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
