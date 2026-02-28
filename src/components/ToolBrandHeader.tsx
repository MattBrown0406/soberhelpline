import logoImg from "@/assets/logo.png";

interface ToolBrandHeaderProps {
  title: string;
  subtitle: string;
  clinicalNote?: string;
  className?: string;
}

export default function ToolBrandHeader({ title, subtitle, clinicalNote, className = "" }: ToolBrandHeaderProps) {
  return (
    <div className={`rounded-xl bg-gradient-to-br from-[hsl(var(--primary)/0.06)] via-transparent to-[hsl(var(--primary)/0.03)] border border-[hsl(var(--primary)/0.15)] p-5 mb-6 ${className}`}>
      <div className="flex items-start gap-4">
        <img 
          src={logoImg} 
          alt="Sober Helpline" 
          className="h-12 w-auto rounded-md shadow-sm flex-shrink-0 mt-0.5" 
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground leading-snug">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{subtitle}</p>
          {clinicalNote && (
            <p className="text-xs text-muted-foreground/80 mt-2 italic border-t border-border/40 pt-2 leading-relaxed">
              {clinicalNote}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
