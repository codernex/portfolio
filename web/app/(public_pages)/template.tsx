export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-in-up">
      {children}
    </div>
  );
}
