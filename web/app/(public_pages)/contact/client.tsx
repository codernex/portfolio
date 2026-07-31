"use client";

import { Command, Mail, MapPin, Phone, Send, ShieldCheck } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

async function contactAction(prevState: unknown, formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");
  const subject = formData.get("subject");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
      method: "POST",
      body: JSON.stringify({ name, email, message, subject }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Transmission failed");

    return { success: true, message: "Payload delivered successfully." };
  } catch (err) {
    return { success: false, message: "Connection error. Retry handshake." };
  }
}

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(contactAction, null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "System ready for input...",
    "Secure SSL connection established.",
  ]);

  useEffect(() => {
    if (state?.message) {
      setTerminalLogs((prev) => [...prev, state.message]);
    }
  }, [state]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 selection:bg-emerald-500/30 selection:text-emerald-400">
      <section className="px-6 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16">
            <span className="font-mono text-sm text-emerald-500">
              $ ./establish_connection.sh
            </span>
            <h1 className="mt-2 text-5xl font-bold text-white tracking-tight">
              Contact Borhan
            </h1>
            <p className="mt-4 text-zinc-500 max-w-xl">
              Have a complex problem that needs a backend solution? Or a project
              that needs 140% performance optimization? Reach out via the
              terminal below.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Contact Info Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                      Base_Location
                    </p>
                    <p className="text-zinc-200">Khulna, Bangladesh</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                      Email_Address
                    </p>
                    <p className="text-zinc-200">borhan.dev@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                      WhatsApp
                    </p>
                    <p className="text-zinc-200">(+88) 01888527959</p>
                  </div>
                </div>
              </div>

              {/* System Log Console */}
              <div className="rounded-xl border border-zinc-900 bg-black p-4 font-mono text-[10px] h-32 flex flex-col justify-end gap-1 overflow-hidden">
                {terminalLogs.map((log, i) => (
                  <div
                    key={i}
                    className={
                      i === terminalLogs.length - 1
                        ? "text-emerald-500 animate-pulse"
                        : "text-zinc-600"
                    }
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-8">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-2xl">
                <div className="bg-zinc-800/50 px-6 py-3 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Command size={14} className="text-zinc-500" />
                    <span className="font-mono text-xs text-zinc-400">
                      secure_comms.sh
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-500/60">
                    <ShieldCheck size={12} />
                    <span>ENCRYPTION: AES-256</span>
                  </div>
                </div>

                <form
                  action={formAction}
                  className="p-8 grid gap-6 sm:grid-cols-2"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase">
                      Input: Name
                    </label>
                    <input
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:border-emerald-500/50 focus:outline-none transition-all"
                      name="name"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase">
                      Input: Email
                    </label>
                    <input
                      required
                      type="email"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:border-emerald-500/50 focus:outline-none transition-all"
                      name="email"
                      placeholder="user@domain.com"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase">
                      Input: Subject
                    </label>
                    <input
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:border-emerald-500/50 focus:outline-none transition-all"
                      name="subject"
                      placeholder="Backend Architecture Query"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase">
                      Input: Message_Body
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:border-emerald-500/50 focus:outline-none transition-all resize-none"
                      name="message"
                      placeholder="Type your transmission here..."
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="group flex w-full items-center justify-center gap-3 rounded-lg bg-emerald-500 py-4 font-mono text-sm font-bold text-black hover:bg-emerald-400 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {isPending ? (
                        <>TRANSMITTING...</>
                      ) : (
                        <>
                          <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                          EXECUTE_SEND
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
