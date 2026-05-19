/**
 * Cloudflare Pages Function — contact form handler
 * Route: POST /submit
 *
 * Required env vars (set in CF Pages → Settings → Environment Variables):
 *   RESEND_API_KEY   — from resend.com (free tier: 3 000 emails/month)
 *   FROM_EMAIL       — verified sender, e.g. contact@cncvectorlab.com
 *                      (domain must be verified in Resend dashboard)
 *   TO_EMAIL         — where submissions land, e.g. bill@cncvectorlab.com
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  /* ── Parse form data ─────────────────────────────────────────────── */
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return badRequest("Could not parse form data.");
  }

  const name    = (formData.get("name")    || "").trim();
  const email   = (formData.get("email")   || "").trim();
  const kind    = (formData.get("kind")    || "Other").trim();
  const message = (formData.get("message") || "").trim();

  /* ── Basic validation ────────────────────────────────────────────── */
  if (!name || !email || !message) {
    return badRequest("Name, email, and message are required.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return badRequest("Invalid email address.");
  }

  /* ── Send via Resend ─────────────────────────────────────────────── */
  const apiKey   = env.RESEND_API_KEY;
  const fromAddr = env.FROM_EMAIL || "contact@cncvectorlab.com";
  const toAddr   = env.TO_EMAIL   || "bill@cncvectorlab.com";

  if (apiKey) {
    const body = JSON.stringify({
      from:     `CNC Vector Lab <${fromAddr}>`,
      to:       [toAddr],
      reply_to: email,
      subject:  `[Contact] ${kind} — ${name}`,
      text: [
        `Name:         ${name}`,
        `Email:        ${email}`,
        `Project type: ${kind}`,
        ``,
        message,
      ].join("\n"),
    });

    const res = await fetch("https://api.resend.com/emails", {
      method:  "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type":  "application/json",
      },
      body,
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", res.status, err);
      // Still redirect so the user doesn't see an error — check logs if missing mail
    }
  } else {
    // RESEND_API_KEY not yet configured — log and continue
    console.warn("RESEND_API_KEY not set. Submission not emailed.", { name, email, kind });
  }

  /* ── Redirect to thank-you page ──────────────────────────────────── */
  const origin  = new URL(request.url).origin;
  return Response.redirect(`${origin}/thank-you.html`, 303);
}

/* ── Helpers ─────────────────────────────────────────────────────────── */
function badRequest(msg) {
  return new Response(msg, {
    status: 400,
    headers: { "Content-Type": "text/plain" },
  });
}
