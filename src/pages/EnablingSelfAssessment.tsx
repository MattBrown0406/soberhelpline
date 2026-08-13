import SEOHead from "@/components/SEOHead";
import FamilySelfAssessment from "@/components/FamilySelfAssessment";

export default function EnablingSelfAssessment() {
  return (
    <>
      <SEOHead
        title="Enabling Self-Assessment | Sober Helpline"
        description="A free enabling self-assessment for families. Name the pattern, see your result immediately, and get free next steps — no email required."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Enabling Self-Assessment",
          url: "https://soberhelpline.com/enabling-self-assessment",
          applicationCategory: "HealthApplication",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description: "Free family enabling self-assessment with an immediate result and free next steps.",
        }}
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-3xl px-4 py-10 md:py-14">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">Free tool</p>
          <h1 className="mb-3 text-3xl font-bold tracking-normal text-logo-blue md:text-4xl">
            Am I helping or making it worse?
          </h1>
          <p className="mb-8 max-w-2xl text-muted-foreground">
            This names enabling patterns so you can see them. There is no email gate. Your result stays on this page, with free next steps.
          </p>
          <FamilySelfAssessment defaultExpanded hideToggle />
        </div>
      </div>
    </>
  );
}
