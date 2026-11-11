import logoImg from "@/assets/logo.png";

interface ToolBrandHeaderProps {
  title: string;
  subtitle: string;
  clinicalNote?: string;
  className?: string;
  headingAs?: "h1" | "h3";
}

// Two looks, one component:
// - at the top of a library guide (headingAs="h1"): the same navy band as the
//   rest of the member area on screen, and a plain letterhead with the logo on
//   paper;
// - inside a card or an embedded assessment (the default, h3): the compact
//   branded strip it has always been.
export default function ToolBrandHeader({ title, subtitle, clinicalNote, className = "", headingAs: Heading = "h3" }: ToolBrandHeaderProps) {
  if (Heading === "h1") {
    return (
      <div
        className={`relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#16294a] via-[#1b3560] to-[#2a4f85] p-5 text-white shadow-lg shadow-[#16294a]/20 sm:p-8 print:rounded-none print:bg-none print:p-0 print:text-foreground print:shadow-none ${className}`}
      >
        <div aria-hidden="true" className="pointer-events-none absolute -right-14 -top-20 h-60 w-60 rounded-full bg-[#e8a73a]/25 blur-3xl print:hidden" />
        <div className="relative flex items-start gap-4">
          {/* The logo is for the printed page; on screen the site header already shows it. */}
          <img src={logoImg} alt="Sober Helpline" className="mt-0.5 hidden h-14 w-auto flex-shrink-0 object-contain print:block" />
          <div className="min-w-0 flex-1">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#f2c675] print:hidden">Family education guide</p>
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl print:text-lg print:font-semibold print:text-foreground">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/85 print:mt-1 print:text-sm print:text-muted-foreground">{subtitle}</p>
            {clinicalNote && (
              <p className="mt-3 border-t border-white/15 pt-3 text-xs italic leading-relaxed text-white/70 print:mt-2 print:border-border/40 print:pt-2 print:text-muted-foreground">
                {clinicalNote}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl bg-gradient-to-br from-[hsl(var(--primary)/0.06)] via-transparent to-[hsl(var(--primary)/0.03)] border border-[hsl(var(--primary)/0.15)] p-5 mb-6 ${className}`}>
      <div className="flex items-start gap-4">
        <img src={logoImg} alt="Sober Helpline" className="h-14 w-auto object-contain flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground leading-snug">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{subtitle}</p>
          {clinicalNote && (
            <p className="text-xs text-muted-foreground/80 mt-2 italic border-t border-border/40 pt-2 leading-relaxed">{clinicalNote}</p>
          )}
        </div>
      </div>
    </div>
  );
}
