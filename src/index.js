/**
 * Cloudflare Worker — CNC Vector Lab website
 * Handles POST /submit (contact form), falls through to static assets for everything else.
 */

import { EmailMessage } from "cloudflare:email";

const FROM = "contact@cncvectorlab.com";
const TO   = "bill@wildwoodcarving.com";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/submit" && request.method === "POST") {
      return handleSubmit(request, env);
    }

    // Serve static assets for everything else
    return env.ASSETS.fetch(request);
  },
};

async function handleSubmit(request, env) {
  /* ── Parse form data ─────────────────────────────────────────────── */
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return badRequest("Could not parse form data.");
  }

  const name     = (formData.get("name")     || "").trim();
  const email    = (formData.get("email")    || "").trim();
  const kind     = (formData.get("kind")     || "Other").trim();
  const message  = (formData.get("message")  || "").trim();
  const platforms = formData.getAll("platform").filter(Boolean);
  const platform  = platforms.length ? platforms.join(", ") : "Not specified";

  /* ── Basic validation ────────────────────────────────────────────── */
  if (!name || !email || !message) {
    return badRequest("Name, email, and message are required.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return badRequest("Invalid email address.");
  }

  /* ── Build raw MIME message ──────────────────────────────────────── */
  const subject = `[Contact] ${kind} — ${name}`;
  const body    = [
    `Name:         ${name}`,
    `Email:        ${email}`,
    `Project type: ${kind}`,
    `Platform:     ${platform}`,
    ``,
    message,
  ].join("\r\n");

  const raw = [
    `MIME-Version: 1.0`,
    `From: CNC Vector Lab <${FROM}>`,
    `To: ${TO}`,
    `Reply-To: ${name} <${email}>`,
    `Subject: ${subject}`,
    `Content-Type: text/plain; charset=utf-8`,
    ``,
    body,
  ].join("\r\n");

  /* ── Send via Cloudflare Email binding ───────────────────────────── */
  try {
    const msg = new EmailMessage(FROM, TO, new Response(raw).body);
    await env.EMAIL.send(msg);
  } catch (err) {
    console.error("Email send failed:", err);
  }

  /* ── Redirect to thank-you page ──────────────────────────────────── */
  const origin = new URL(request.url).origin;
  return Response.redirect(`${origin}/thank-you.html`, 303);
}

function badRequest(msg) {
  return new Response(msg, {
    status: 400,
    headers: { "Content-Type": "text/plain" },
  });
}
