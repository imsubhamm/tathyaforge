import { ButtonLink } from "@/components/ButtonLink";

type CTASectionProps = {
  title: string;
  buttonLabel: string;
  href: string;
};

export function CTASection({ title, buttonLabel, href }: CTASectionProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="surface rounded-lg p-8 sm:p-10 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <ButtonLink href={href}>{buttonLabel}</ButtonLink>
        </div>
      </div>
    </section>
  );
}
