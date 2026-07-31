import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const PageHeader: React.FC<{
  breadCrumb: string;
}> = ({ breadCrumb }) => {
  return (
    <header className="relative border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2 font-mono text-sm text-zinc-500 hover:text-emerald-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>cd ..</span>
          </Link>
          <div className="font-mono text-xs text-zinc-600 hidden sm:block">
            {breadCrumb} <span className="animate-pulse">_</span>
          </div>
        </div>
      </div>
    </header>
  );
};
