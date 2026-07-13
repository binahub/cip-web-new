interface ServiceRulesProps {
  title: string;
  rules: string[];
}

export default function ServiceRules({ title, rules }: ServiceRulesProps) {
  return (
    <section className="mx-auto w-full max-w-[381px] text-center" dir="rtl">
      <h2 className="mb-3 text-base font-bold tracking-[0.1px] text-white">{title}</h2>
      <div className="space-y-1 text-sm leading-[25px] tracking-[0.1px] text-service-body">
        {rules.map((rule) => (
          <p key={rule}>{rule}</p>
        ))}
      </div>
    </section>
  );
}
