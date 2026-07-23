import { techStack } from "@/lib/content";

export function TechStack() {
  return (
    <div className="flex flex-wrap gap-2.5 sm:gap-3">
      {techStack.map((tech) => (
        <span
          key={tech}
          className="rounded-md border border-slate-200 bg-white/75 px-3 py-2 text-xs font-medium text-slate-700 shadow-sm sm:px-4 sm:text-sm"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}
