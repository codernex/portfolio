import CommandPalette from "@/components/shared/CommandPalette";

export default function PublicLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <CommandPalette />
      {children}
    </>
  );
}
