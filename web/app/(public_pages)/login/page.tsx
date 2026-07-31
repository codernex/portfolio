"use client";

import { useAuth } from "@/auth/store";
import { BackendAuthResponse } from "@/auth/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiInstance } from "@/lib/axios";
import { AxiosError } from "axios";
import {
  ChevronRight,
  Loader2,
  Lock,
  ShieldCheck,
  Terminal,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await apiInstance.post<BackendAuthResponse>("/auth/login", {
        email,
        password,
      });
      // Handle login response with useAuth
      await login(res.data, "/dashboard");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      if (err.response?.data?.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error("Authentication failed")
      }
      console.error("Authentication sequence failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 selection:bg-emerald-500/30">
      <div className="w-full max-w-md relative">
        {/* Terminal Title Bar */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-t-xl px-4 py-2 flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/20" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/20" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/20" />
          </div>
          <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
            Auth_Protocol_v2.4
          </span>
        </div>

        {/* Auth Container */}
        <div className="bg-zinc-900/40 border-x border-b border-zinc-800 rounded-b-xl p-8 backdrop-blur-sm shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 mb-4">
              <Terminal size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              System Login
            </h1>
            <p className="text-xs font-mono text-zinc-500 mt-2 tracking-[0.2em]">
              IDENT_REQ: ADMIN_PRIVILEGES
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase ml-1">
                  Identity_Token (Email)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 h-4 w-4" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@codernex.dev"
                    className="bg-zinc-950 border-zinc-800 pl-10 focus-visible:ring-emerald-500/50 text-zinc-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase ml-1">
                  Access_Key (Password)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 h-4 w-4" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="bg-zinc-950 border-zinc-800 pl-10 focus-visible:ring-emerald-500/50 text-zinc-200"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 text-black hover:bg-emerald-400 font-mono font-bold py-6 group"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> AUTHENTICATING...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  INITIALIZE_SESSION{" "}
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
              )}
            </Button>
          </form>

          {/* Connection Footer */}
          <div className="mt-8 pt-6 border-t border-zinc-800/50 flex items-center justify-between text-[10px] font-mono text-zinc-600">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-emerald-500/40" />
              <span>AES-256-GCM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>SSH_ENCRYPTED</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
