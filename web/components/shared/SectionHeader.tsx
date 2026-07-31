export const SectionHeader: React.FC<{
  command: string;
  title: string;
}> = ({ command, title }) => {
  return (
    <div className="mb-12">
      <span className="font-mono text-sm text-emerald-500">
        <span className="opacity-60">$ </span>ls {command}/
      </span>
      <h2 className="mt-2 text-4xl font-bold text-white">{title}</h2>
    </div>
  );
};
