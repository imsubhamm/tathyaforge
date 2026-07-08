type ProcessStepProps = {
  label: string;
  index: number;
};

export function ProcessStep({ label, index }: ProcessStepProps) {
  return (
    <li className="surface rounded-lg p-5">
      <span className="font-mono text-sm text-teal-300">{String(index + 1).padStart(2, "0")}</span>
      <h3 className="mt-4 text-lg font-semibold text-white">{label}</h3>
    </li>
  );
}
