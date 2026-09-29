Deno.serve(async () => {
  const r = await fetch("https://api.sendgrid.com/v3/asm/suppressions/global", {
    method: "POST",
    headers: { Authorization: `Bearer ${Deno.env.get("SENDGRID_API_KEY")}`, "Content-Type": "application/json" },
    body: JSON.stringify({ recipient_emails: ["julie.allingham@gmail.com"] }),
  });
  return new Response(JSON.stringify({ status: r.status, body: await r.text() }));
});
