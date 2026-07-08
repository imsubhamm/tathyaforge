type ServiceCardProps = {
  title: string;
  summary: string;
};

export function ServiceCard({ title, summary }: ServiceCardProps) {
  return (
    <article className="surface rounded-lg p-6 transition duration-300 hover:-translate-y-1 hover:border-teal-300/45">
      <div className="mb-5 h-1 w-12 rounded-full bg-teal-300" />
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{summary}</p>
    </article>
  );
}
