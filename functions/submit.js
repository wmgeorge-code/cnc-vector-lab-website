/**
 * Cloudflare Pages Function — contact form handler
 * Route: POST /submit
 *
 * Uses Cloudflare's native send_email binding — no API key needed.
 *
 * One-time setup in Cloudflare Pages dashboard:
 *   Pages → your project → Settings → Functions → Email bindings
 *   Binding name : EMAIL
 *   Destination  : bill@cncvectorlab.com
 *
 * The FROM address must be on a domain you have verified in
 * Cloudflare Email Routing (e.g. contact@cncvectorlab.com).
 */

import { EmailMessage } from "cloudflare:email";

const FROM = "contact@cncvectorlab.com";
const TO   = "contact@cncvectorlab.com";

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

  /* ── Build raw MIME message ──────────────────────────────────────── */
  const subject = `[Contact] ${kind} — ${name}`;
  const body    = [
    `Name:         ${name}`,
    `Email:        ${email}`,
    `Project type: ${kind}`,
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
    // Still redirect — don't show raw errors to the submitter
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
