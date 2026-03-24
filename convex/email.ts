import { internalAction } from "./_generated/server";
import { v } from "convex/values";

const TIMEOUT_MS = 10_000;

function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function maskEmail(email: string): string {
  const atIndex = email.indexOf("@");
  if (atIndex <= 0) return "***";
  return `${email[0]}***${email.slice(atIndex)}`;
}

function buildEmailHtml(args: {
  orderId: string;
  planName: string;
  price: number;
}): string {
  const shortOrderId = args.orderId.slice(-8).toUpperCase();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Cut Plan is Ready — Woodgrain &amp; Sawdust</title>
</head>
<body style="margin: 0; padding: 0; background-color: #faf7f2; font-family: Georgia, serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf7f2; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="background-color: #5c3d2e; padding: 32px 40px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="margin: 0; color: #faf7f2; font-size: 24px; font-weight: normal; letter-spacing: 1px;">
                Woodgrain &amp; Sawdust
              </h1>
              <p style="margin: 8px 0 0; color: #d4a853; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">
                Your Plan is Ready
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color: #ffffff; padding: 40px;">

              <p style="margin: 0 0 16px; font-size: 18px; color: #3d2b1f;">
                Thanks for your purchase!
              </p>
              <p style="margin: 0 0 32px; font-size: 15px; color: #5c4a3a; line-height: 1.6;">
                Your cut plan is ready to download. Your order reference is
                <strong style="color: #3d2b1f;">#${shortOrderId}</strong>.
              </p>

              <!-- Plan details -->
              <div style="background-color: #faf7f2; padding: 20px; border-radius: 4px; border-left: 3px solid #d4a853; margin-bottom: 24px;">
                <p style="margin: 0 0 4px; font-size: 16px; color: #3d2b1f; font-weight: bold;">${escapeHtml(args.planName)}</p>
                <p style="margin: 0; font-size: 14px; color: #5c4a3a;">${formatCurrency(args.price)}</p>
              </div>

              <p style="margin: 0 0 16px; font-size: 15px; color: #5c4a3a; line-height: 1.6;">
                You can download your plan anytime by visiting your order confirmation page.
                Happy building!
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f0ebe3; padding: 24px 40px; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #5c4a3a;">
                Questions? Reply to this email or visit us at
                <a href="https://woodgrainandsawdust.com" style="color: #d4a853; text-decoration: none;">woodgrainandsawdust.com</a>
              </p>
              <p style="margin: 0; font-size: 12px; color: #8a7060;">
                &copy; ${new Date().getFullYear()} Woodgrain &amp; Sawdust. Crafted with care.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const sendOrderConfirmationEmail = internalAction({
  args: {
    customerEmail: v.string(),
    orderId: v.string(),
    planName: v.string(),
    price: v.number(),
  },
  handler: async (_ctx, args): Promise<void> => {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail =
      process.env.RESEND_FROM_EMAIL ?? "Woodgrain & Sawdust <orders@woodgrainandsawdust.com>";

    if (!apiKey) {
      console.warn(
        "[email] RESEND_API_KEY is not set — skipping order confirmation email"
      );
      return;
    }

    const html = buildEmailHtml({
      orderId: args.orderId,
      planName: args.planName,
      price: args.price,
    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: args.customerEmail,
          subject: `Your cut plan is ready to download (#${args.orderId.slice(-8).toUpperCase()})`,
          html,
        }),
        signal: controller.signal,
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error(`Resend API request timed out after ${TIMEOUT_MS}ms`);
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      throw new Error(
        `Resend API error ${response.status} [provider response omitted]`
      );
    }

    console.log(
      `[email] Order confirmation sent to ${maskEmail(args.customerEmail)} for order ${args.orderId}`
    );
  },
});
