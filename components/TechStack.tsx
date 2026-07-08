import { techStack } from "@/lib/content";

export function TechStack() {
  return (
    <div className="flex flex-wrap gap-3">
      {techStack.map((tech) => (
        <span
          key={tech}
          className="rounded-md border border-slate-700/80 bg-slate-950/45 px-4 py-2 text-sm font-medium text-slate-200"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}
