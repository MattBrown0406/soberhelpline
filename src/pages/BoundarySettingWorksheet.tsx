import { useState, useEffect, useRef } from "react";
import SEOHead from "@/components/SEOHead";
import BoundaryWorksheet from "@/components/BoundaryWorksheet";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const BoundarySettingWorksheet = () => {
  const [user, setUser] = useState<User | null>(null);
  const worksheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const worksheetContent = worksheetRef.current;
    if (!worksheetContent) return;

    // Clone content and clean up interactive elements for print
    const clone = worksheetContent.cloneNode(true) as HTMLElement;

    // Get all textareas' values and set them on the clones
    const originalTextareas = worksheetContent.querySelectorAll('textarea');
    const clonedTextareas = clone.querySelectorAll('textarea');
    originalTextareas.forEach((ta, i) => {
      if (clonedTextareas[i]) {
        const p = document.createElement('p');
        p.style.whiteSpace = 'pre-wrap';
        p.style.border = '1px solid #ddd';
        p.style.padding = '8px';
        p.style.borderRadius = '6px';
        p.style.minHeight = '40px';
        p.style.fontSize = '14px';
        p.textContent = ta.value || '(not filled in)';
        clonedTextareas[i].replaceWith(p);
      }
    });

    // Replace checkboxes with text indicators
    const checkboxButtons = clone.querySelectorAll('button[role="checkbox"]');
    checkboxButtons.forEach((btn) => {
      const isChecked = btn.getAttribute('data-state') === 'checked' || btn.getAttribute('aria-checked') === 'true';
      const span = document.createElement('span');
      span.textContent = isChecked ? '☑' : '☐';
      span.style.marginRight = '4px';
      span.style.fontSize = '16px';
      btn.replaceWith(span);
    });

    printWindow.document.write(`
      <html>
        <head>
          <title>Boundary Setting Worksheet - Sober Helpline</title>
          <style>
            body { font-family: Georgia, 'Times New Roman', serif; padding: 30px 40px; line-height: 1.6; color: #1a1a1a; max-width: 800px; margin: 0 auto; }
            h1 { font-size: 24px; border-bottom: 2px solid #2d6a4f; padding-bottom: 8px; color: #2d6a4f; }
            h2, h3 { color: #2d6a4f; }
            h3 { font-size: 16px; margin-top: 20px; }
            p { font-size: 14px; }
            button { display: none !important; }
            svg { display: none !important; }
            [data-radix-collection-item] { display: none !important; }
            .text-muted-foreground { color: #666; }
            @media print { body { padding: 20px; } }
            @page { margin: 0.75in; }
          </style>
        </head>
        <body>
          <h1>Boundary Setting Worksheet</h1>
          <p style="color:#666; margin-bottom:24px;">Protecting Recovery, Safety, and Sanity &bull; Sober Helpline &bull; ${new Date().toLocaleDateString()}</p>
          ${clone.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <>
      <SEOHead
        title="Boundary Setting Worksheet | Sober Helpline"
        description="A free, interactive worksheet to help families set healthy boundaries with loved ones struggling with addiction."
      />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Boundary Setting Worksheet
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Use this interactive worksheet to identify, define, and strengthen healthy boundaries with your loved one.
            </p>
            <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="mt-4 gap-2">
              <Download className="h-4 w-4" />
              Download as PDF
            </Button>
          </div>
          <div ref={worksheetRef}>
            {user ? (
              <BoundaryWorksheet user={user} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Sign in to save your worksheet progress.</p>
                <BoundaryWorksheet user={{ id: "anonymous" } as User} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BoundarySettingWorksheet;
