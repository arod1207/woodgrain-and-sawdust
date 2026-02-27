import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { orderItemsValidator, shippingAddressValidator } from "./ordersInternal";

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
  customerName: string;
  orderId: string;
  items: Array<{ name: string; price: number; quantity: number }>;
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress?: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}): string {
  const itemRows = args.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 8px; border-bottom: 1px solid #e8ddd0; color: #3d2b1f;">${escapeHtml(item.name)}</td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #e8ddd0; color: #3d2b1f; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #e8ddd0; color: #3d2b1f; text-align: right;">${formatCurrency(item.price)}</td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #e8ddd0; color: #3d2b1f; text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
      </tr>`
    )
    .join("");

  const shortOrderId = args.orderId.slice(-8).toUpperCase();

  const addressLines = args.shippingAddress
    ? `
    <p style="margin: 0; color: #3d2b1f;">${escapeHtml(args.shippingAddress.name)}</p>
    <p style="margin: 0; color: #3d2b1f;">${escapeHtml(args.shippingAddress.line1)}</p>
    ${args.shippingAddress.line2 ? `<p style="margin: 0; color: #3d2b1f;">${escapeHtml(args.shippingAddress.line2)}</p>` : ""}
    <p style="margin: 0; color: #3d2b1f;">${escapeHtml(args.shippingAddress.city)}, ${escapeHtml(args.shippingAddress.state)} ${escapeHtml(args.shippingAddress.postalCode)}</p>
    <p style="margin: 0; color: #3d2b1f;">${escapeHtml(args.shippingAddress.country)}</p>
    `
    : `<p style="color: #3d2b1f;">—</p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmed — Woodgrain &amp; Sawdust</title>
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
                Order Confirmed
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color: #ffffff; padding: 40px;">

              <!-- Greeting -->
              <p style="margin: 0 0 16px; font-size: 18px; color: #3d2b1f;">
                Hello ${escapeHtml(args.customerName)},
              </p>
              <p style="margin: 0 0 32px; font-size: 15px; color: #5c4a3a; line-height: 1.6;">
                Thank you for your order! We handcraft each piece with care and will be in touch
                once your order ships. Your order reference is
                <strong style="color: #3d2b1f;">#${shortOrderId}</strong>.
              </p>

              <!-- Items table -->
              <h2 style="margin: 0 0 12px; font-size: 15px; color: #5c3d2e; text-transform: uppercase; letter-spacing: 1px; font-weight: normal;">
                Order Summary
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-size: 14px;">
                <thead>
                  <tr style="background-color: #faf7f2;">
                    <th style="padding: 10px 8px; text-align: left; color: #5c4a3a; font-weight: normal; border-bottom: 2px solid #d4a853;">Item</th>
                    <th style="padding: 10px 8px; text-align: center; color: #5c4a3a; font-weight: normal; border-bottom: 2px solid #d4a853;">Qty</th>
                    <th style="padding: 10px 8px; text-align: right; color: #5c4a3a; font-weight: normal; border-bottom: 2px solid #d4a853;">Price</th>
                    <th style="padding: 10px 8px; text-align: right; color: #5c4a3a; font-weight: normal; border-bottom: 2px solid #d4a853;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" style="padding: 8px 8px 4px; text-align: right; color: #5c4a3a; font-size: 13px;">Subtotal</td>
                    <td style="padding: 8px 8px 4px; text-align: right; color: #3d2b1f; font-size: 13px;">${formatCurrency(args.subtotal)}</td>
                  </tr>
                  <tr>
                    <td colspan="3" style="padding: 4px 8px; text-align: right; color: #5c4a3a; font-size: 13px;">Shipping</td>
                    <td style="padding: 4px 8px; text-align: right; color: #3d2b1f; font-size: 13px;">${args.shipping === 0 ? "Free" : formatCurrency(args.shipping)}</td>
                  </tr>
                  <tr style="border-top: 2px solid #d4a853;">
                    <td colspan="3" style="padding: 10px 8px 4px; text-align: right; color: #3d2b1f; font-weight: bold; font-size: 15px;">Total</td>
                    <td style="padding: 10px 8px 4px; text-align: right; color: #3d2b1f; font-weight: bold; font-size: 15px;">${formatCurrency(args.total)}</td>
                  </tr>
                </tfoot>
              </table>

              <!-- Shipping address -->
              <h2 style="margin: 32px 0 12px; font-size: 15px; color: #5c3d2e; text-transform: uppercase; letter-spacing: 1px; font-weight: normal;">
                Shipping To
              </h2>
              <div style="background-color: #faf7f2; padding: 16px; border-radius: 4px; border-left: 3px solid #d4a853; font-size: 14px; line-height: 1.8;">
                ${addressLines}
              </div>

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
                &copy; ${new Date().getFullYear()} Woodgrain &amp; Sawdust. Handcrafted with care.
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
    customerName: v.string(),
    orderId: v.string(),
    items: orderItemsValidator,
    subtotal: v.number(),
    shipping: v.number(),
    total: v.number(),
    shippingAddress: shippingAddressValidator,
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
      customerName: args.customerName,
      orderId: args.orderId,
      items: args.items,
      subtotal: args.subtotal,
      shipping: args.shipping,
      total: args.total,
      shippingAddress: args.shippingAddress,
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
          subject: `Your Woodgrain & Sawdust order is confirmed (#${args.orderId.slice(-8).toUpperCase()})`,
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
