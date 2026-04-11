import { useState, useEffect } from "react";
import { Shield } from "lucide-react";

const SITE_PASSWORD = "cfs2026";
const STORAGE_KEY = "cfs-auth";

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") setAuthed(true);
    setTimeout(() => setMounted(true), 50);
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
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <form
        onSubmit={handleSubmit}
        className={`relative w-full max-w-sm space-y-6 p-10 bg-card/80 backdrop-blur-xl rounded-2xl border border-border/60 shadow-2xl shadow-primary/5 transition-all duration-500 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">NÈKO</h1>
            <p className="text-xs text-muted-foreground mt-1">Mike Nichols — Project Intelligence</p>
          </div>
        </div>

        <div className="space-y-2">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter password"
            autoFocus
            className={`w-full rounded-xl border bg-background/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
              error ? "border-destructive ring-2 ring-destructive/30 animate-[shake_0.3s_ease-in-out]" : "border-border"
            }`}
          />
          {error && <p className="text-xs text-destructive text-center">Incorrect password</p>}
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
        >
          Unlock
        </button>

        <p className="text-[10px] text-muted-foreground/50 text-center">Computerway Food Systems · Secure Access</p>
      </form>
    </div>
  );
}
