import Navbar from "@/components/shared/Navbar";
import CommandPalette from "@/components/shared/CommandPalette";

export default function PublicLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="pt-16">
      <Navbar />
      <CommandPalette />
      {children}
    </div>
  );
}
