interface SectionCardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function SectionCard({
  title,
  description,
  icon,
  children,
  className = "",
  noPadding = false,
}: SectionCardProps) {
  return (
    <section className={`card-base overflow-hidden ${className}`}>
      {(title || description) && (
        <div className={`border-b border-gray-100 ${noPadding ? "px-6 py-5" : "mb-5 pb-5"}`}>
          {title && (
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-scout-charcoal">
              {icon}
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
      <div className={noPadding ? "" : ""}>{children}</div>
    </section>
  );
}
