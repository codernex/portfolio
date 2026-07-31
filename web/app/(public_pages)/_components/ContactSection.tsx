"use client";

import { useActionState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

// Mock server action (In a real Next.js app, this would be in a separate file with "use server")
async function contactAction(prevState: any, formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
      method: "POST",
      body: JSON.stringify({ name, email, message }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Transmission failed");

    return { success: true, message: "Payload delivered successfully." };
  } catch (err) {
    return { success: false, message: "Connection error. Retry handshake." };
  }
}

export default function ContactSection() {
  // useActionState is the new way to handle form states in React 19 / Next.js
  const [state, formAction, isPending] = useActionState(contactAction, null);

  return (
    <section className="relative border-t border-zinc-800 px-6 py-24 bg-zinc-950">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <span className="font-mono text-sm text-emerald-500">
            <span className="opacity-60">$ </span>./init_handshake.sh
          </span>
          <h2 className="mt-2 text-4xl font-bold text-white">Contact Me</h2>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/30 px-4 py-2 text-[10px] font-mono">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">STDOUT:</span>
              <span className="text-zinc-500 uppercase">
                {isPending
                  ? "Transmitting..."
                  : state?.success
                  ? "Success"
                  : "Ready for input"}
              </span>
            </div>
            <div className="text-zinc-600">v1.0.4</div>
          </div>

          <form action={formAction} className="p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="name"
                required
                placeholder="Name"
                className="w-full bg-zinc-950 border border-zinc-800 p-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none transition-all"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                className="w-full bg-zinc-950 border border-zinc-800 p-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none transition-all"
              />
            </div>
            <textarea
              name="message"
              required
              placeholder="Message Payload..."
              rows={5}
              className="w-full bg-zinc-950 border border-zinc-800 p-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none transition-all"
            />

            <button
              disabled={isPending}
              className="group flex w-full items-center justify-center gap-2 rounded bg-emerald-500 py-3 font-mono text-sm font-bold text-black hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              )}
              {isPending ? "EXECUTING..." : "SEND_MESSAGE"}
            </button>

            {/* Status Messages */}
            {state && (
              <div
                className={`mt-4 p-3 rounded border font-mono text-xs flex items-center gap-2 ${
                  state.success
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                    : "bg-red-500/10 border-red-500/20 text-red-500"
                }`}
              >
                {state.success ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <span className="text-red-500">!!</span>
                )}
                {state.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
