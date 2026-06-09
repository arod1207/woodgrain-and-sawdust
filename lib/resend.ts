import { Resend } from 'resend'
import { getSiteUrl } from '@/lib/siteUrl'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'hello@woodgrainandsawdust.com'
const SITE_URL = getSiteUrl()
const BUY_ME_A_COFFEE_URL = 'https://buymeacoffee.com/woodgrainandsawdust'

export async function sendDownloadConfirmation({
  toName,
  toEmail,
  planName,
  downloadUrl,
  unsubscribeUrl,
}: {
  toName: string
  toEmail: string
  planName: string
  downloadUrl: string
  unsubscribeUrl: string
}) {
  await resend.emails.send({
    from: `Woodgrain & Sawdust <${FROM}>`,
    to: toEmail,
    subject: `Your "${planName}" cut plan is ready!`,
    headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>` },
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#ece7db;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ece7db;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;">

        <!-- Logo -->
        <tr>
          <td style="padding:0 0 20px;text-align:center;">
            <img
              src="${SITE_URL}/logo.jpg"
              alt="Woodgrain &amp; Sawdust"
              width="96"
              height="96"
              style="display:block;margin:0 auto;border-radius:50%;border:3px solid #d4851a;box-shadow:0 2px 8px rgba(0,0,0,0.15);"
            />
          </td>
        </tr>

        <!-- Card -->
        <tr>
          <td style="background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #ddd5c5;box-shadow:0 2px 12px rgba(0,0,0,0.07);">

            <!-- Amber top stripe -->
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="height:5px;background:linear-gradient(to right,#b8640f,#d4851a,#e8a540);font-size:0;line-height:5px;">&nbsp;</td>
            </tr></table>

            <!-- Body -->
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="padding:36px 40px 28px;">

                <p style="margin:0 0 6px;font-size:11px;font-weight:bold;letter-spacing:2.5px;text-transform:uppercase;color:#c4751a;text-align:center;">Woodgrain &amp; Sawdust</p>

                <h1 style="margin:0 0 28px;font-size:22px;color:#3d2b1f;text-align:center;font-weight:normal;line-height:1.3;">Your cut plan is ready!</h1>

                <p style="margin:0 0 6px;font-size:15px;color:#5a4a3a;line-height:1.7;">Hi ${toName},</p>
                <p style="margin:0 0 28px;font-size:15px;color:#5a4a3a;line-height:1.7;">
                  Thanks for downloading the <strong style="color:#3d2b1f;">${planName}</strong> plan! If you ever lose or misplace your PDF, use the button below to download it again — the link is good for 7 days.
                </p>

                <div style="text-align:center;margin:0 0 32px;">
                  <a href="${downloadUrl}"
                     style="display:inline-block;background:#d4851a;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;padding:15px 40px;border-radius:50px;letter-spacing:0.3px;">
                    Download Plan
                  </a>
                </div>

                <hr style="border:none;border-top:1px solid #ede8de;margin:0 0 24px;" />

                <p style="margin:0 0 16px;font-size:14px;color:#7a6a5a;line-height:1.7;text-align:center;">
                  If this plan saves you some time (or just comes out awesome), consider buying me a beer — it helps keep the free plans coming!
                </p>
                <div style="text-align:center;">
                  <a href="${BUY_ME_A_COFFEE_URL}"
                     style="display:inline-block;color:#5a3e00;font-size:14px;font-weight:bold;text-decoration:none;background-color:#f5c842;border:2px solid #f5c842;padding:10px 26px;border-radius:50px;">
                    🍺 Buy Me a Beer
                  </a>
                </div>

              </td>
            </tr></table>


          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 16px 8px;text-align:center;">
            <p style="margin:0 0 6px;font-size:12px;color:#9a8a7a;line-height:1.6;">
              You're receiving this because you downloaded a free plan from
              <a href="${SITE_URL}" style="color:#c4751a;text-decoration:none;">woodgrainandsawdust.com</a>.
            </p>
            <p style="margin:0;font-size:11px;color:#b0a090;">
              <a href="${unsubscribeUrl}" style="color:#b0a090;text-decoration:none;">Unsubscribe from future emails</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
    `.trim(),
  })
}

export async function sendOrderConfirmation({
  toName,
  toEmail,
  crossName,
  amountTotal,
  shippingAddress,
}: {
  toName: string
  toEmail: string
  crossName: string
  amountTotal: number // cents
  shippingAddress?: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
}) {
  const dollars = (amountTotal / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  const addressBlock = shippingAddress
    ? `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #ede8de;font-size:13px;color:#9a8a7a;width:110px;vertical-align:top;">Ship to</td>
        <td style="padding:10px 0;border-bottom:1px solid #ede8de;font-size:14px;color:#3d2b1f;line-height:1.6;">
          ${shippingAddress.line1}${shippingAddress.line2 ? '<br>' + shippingAddress.line2 : ''}<br>
          ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postal_code}
        </td>
      </tr>`
    : ''

  await resend.emails.send({
    from: `Woodgrain & Sawdust <${FROM}>`,
    to: toEmail,
    subject: `Your order is confirmed — ${crossName}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#ece7db;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ece7db;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;">

        <!-- Logo -->
        <tr>
          <td style="padding:0 0 20px;text-align:center;">
            <img
              src="${SITE_URL}/logo.jpg"
              alt="Woodgrain &amp; Sawdust"
              width="96"
              height="96"
              style="display:block;margin:0 auto;border-radius:50%;border:3px solid #d4851a;box-shadow:0 2px 8px rgba(0,0,0,0.15);"
            />
          </td>
        </tr>

        <!-- Card -->
        <tr>
          <td style="background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #ddd5c5;box-shadow:0 2px 12px rgba(0,0,0,0.07);">

            <!-- Amber top stripe -->
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="height:5px;background:linear-gradient(to right,#b8640f,#d4851a,#e8a540);font-size:0;line-height:5px;">&nbsp;</td>
            </tr></table>

            <!-- Body -->
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="padding:36px 40px 36px;">

                <p style="margin:0 0 6px;font-size:11px;font-weight:bold;letter-spacing:2.5px;text-transform:uppercase;color:#c4751a;text-align:center;">Order Confirmed</p>

                <h1 style="margin:0 0 8px;font-size:22px;color:#3d2b1f;text-align:center;font-weight:normal;line-height:1.3;">Thank you, ${toName}!</h1>
                <p style="margin:0 0 32px;font-size:14px;color:#9a8a7a;text-align:center;line-height:1.6;">Your handmade cross is on its way — I'll get it packaged up and shipped out soon.</p>

                <!-- Order details -->
                <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #ede8de;font-size:13px;color:#9a8a7a;width:110px;">Item</td>
                    <td style="padding:10px 0;border-bottom:1px solid #ede8de;font-size:14px;color:#3d2b1f;font-weight:bold;">${crossName}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #ede8de;font-size:13px;color:#9a8a7a;">Total</td>
                    <td style="padding:10px 0;border-bottom:1px solid #ede8de;font-size:14px;color:#3d2b1f;font-weight:bold;">${dollars}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #ede8de;font-size:13px;color:#9a8a7a;">Shipping</td>
                    <td style="padding:10px 0;border-bottom:1px solid #ede8de;font-size:14px;color:#3d2b1f;">Standard (USPS, 5–10 business days)</td>
                  </tr>
                  ${addressBlock}
                </table>

                <hr style="border:none;border-top:1px solid #ede8de;margin:0 0 24px;" />

                <p style="margin:0 0 6px;font-size:14px;color:#7a6a5a;line-height:1.7;text-align:center;">
                  Every cross is one of a kind and made by hand — thanks for supporting a small woodworking shop. Questions? Just reply to this email.
                </p>

              </td>
            </tr></table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 16px 8px;text-align:center;">
            <p style="margin:0 0 6px;font-size:12px;color:#9a8a7a;line-height:1.6;">
              You're receiving this because you placed an order at
              <a href="${SITE_URL}" style="color:#c4751a;text-decoration:none;">woodgrainandsawdust.com</a>.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
    `.trim(),
  })
}

export async function sendNewOrderNotification({
  customerName,
  customerEmail,
  crossName,
  amountTotal,
  shippingAddress,
}: {
  customerName: string
  customerEmail: string
  crossName: string
  amountTotal: number // cents
  shippingAddress?: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
}) {
  const dollars = (amountTotal / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  const addressLines = shippingAddress
    ? [
        shippingAddress.line1,
        shippingAddress.line2,
        `${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postal_code}`,
      ]
        .filter(Boolean)
        .join('<br>')
    : '—'

  await resend.emails.send({
    from: `Woodgrain & Sawdust <${FROM}>`,
    to: FROM,
    subject: `New order: ${crossName}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:32px 16px;background:#f5f0e8;font-family:Georgia,serif;">
  <table width="100%" style="max-width:480px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <tr><td style="height:4px;background:linear-gradient(to right,#b8640f,#d4851a,#e8a540);font-size:0;line-height:4px;">&nbsp;</td></tr>
    <tr><td style="padding:32px;">
      <p style="margin:0 0 4px;font-size:20px;font-weight:bold;color:#5c3d2e;">New order!</p>
      <p style="margin:0 0 24px;font-size:13px;color:#9a8a7a;">Someone just purchased a cross from the shop.</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #ede8de;font-size:13px;color:#9a8a7a;width:100px;">Cross</td>
          <td style="padding:10px 0;border-bottom:1px solid #ede8de;font-size:14px;color:#3d2b1f;font-weight:bold;">${crossName}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #ede8de;font-size:13px;color:#9a8a7a;">Amount</td>
          <td style="padding:10px 0;border-bottom:1px solid #ede8de;font-size:14px;color:#3d2b1f;font-weight:bold;">${dollars}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #ede8de;font-size:13px;color:#9a8a7a;">Customer</td>
          <td style="padding:10px 0;border-bottom:1px solid #ede8de;font-size:14px;color:#3d2b1f;">${customerName}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #ede8de;font-size:13px;color:#9a8a7a;">Email</td>
          <td style="padding:10px 0;border-bottom:1px solid #ede8de;font-size:14px;color:#3d2b1f;">${customerEmail}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:13px;color:#9a8a7a;vertical-align:top;">Ship to</td>
          <td style="padding:10px 0;font-size:14px;color:#3d2b1f;line-height:1.6;">${addressLines}</td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
    `.trim(),
  })
}

export async function sendShippingConfirmation({
  toName,
  toEmail,
  crossName,
  trackingNumber,
}: {
  toName: string
  toEmail: string
  crossName: string
  trackingNumber?: string
}) {
  const trackingBlock = trackingNumber
    ? `
        <div style="margin:0 0 28px;background:#faf7f2;border:1px solid #ede8de;border-radius:10px;padding:20px 24px;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#c4751a;">Tracking Number</p>
          <p style="margin:0 0 12px;font-size:18px;font-weight:bold;color:#3d2b1f;letter-spacing:0.5px;">${trackingNumber}</p>
          <a href="https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(trackingNumber)}"
             style="display:inline-block;background:#d4851a;color:#ffffff;font-size:13px;font-weight:bold;text-decoration:none;padding:10px 24px;border-radius:50px;">
            Track on USPS
          </a>
        </div>`
    : `<p style="margin:0 0 28px;font-size:15px;color:#5a4a3a;line-height:1.7;">I'll send you the tracking number as soon as it's available.</p>`

  await resend.emails.send({
    from: `Woodgrain & Sawdust <${FROM}>`,
    to: toEmail,
    subject: `Your order has shipped — ${crossName}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#ece7db;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ece7db;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;">

        <!-- Logo -->
        <tr>
          <td style="padding:0 0 20px;text-align:center;">
            <img
              src="${SITE_URL}/logo.jpg"
              alt="Woodgrain &amp; Sawdust"
              width="96"
              height="96"
              style="display:block;margin:0 auto;border-radius:50%;border:3px solid #d4851a;box-shadow:0 2px 8px rgba(0,0,0,0.15);"
            />
          </td>
        </tr>

        <!-- Card -->
        <tr>
          <td style="background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #ddd5c5;box-shadow:0 2px 12px rgba(0,0,0,0.07);">

            <!-- Amber top stripe -->
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="height:5px;background:linear-gradient(to right,#b8640f,#d4851a,#e8a540);font-size:0;line-height:5px;">&nbsp;</td>
            </tr></table>

            <!-- Body -->
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="padding:36px 40px 36px;">

                <p style="margin:0 0 6px;font-size:11px;font-weight:bold;letter-spacing:2.5px;text-transform:uppercase;color:#c4751a;text-align:center;">On Its Way</p>

                <h1 style="margin:0 0 8px;font-size:22px;color:#3d2b1f;text-align:center;font-weight:normal;line-height:1.3;">Your order has shipped!</h1>
                <p style="margin:0 0 28px;font-size:14px;color:#9a8a7a;text-align:center;line-height:1.6;">
                  Your <strong style="color:#3d2b1f;">${crossName}</strong> is packed up and on its way to you.
                </p>

                ${trackingBlock}

                <hr style="border:none;border-top:1px solid #ede8de;margin:0 0 24px;" />

                <p style="margin:0;font-size:14px;color:#7a6a5a;line-height:1.7;text-align:center;">
                  Thanks so much for your order, ${toName} — I hope it means as much to you as it did to make. Questions? Just reply to this email.
                </p>

              </td>
            </tr></table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 16px 8px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9a8a7a;line-height:1.6;">
              You're receiving this because you placed an order at
              <a href="${SITE_URL}" style="color:#c4751a;text-decoration:none;">woodgrainandsawdust.com</a>.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
    `.trim(),
  })
}

export async function sendSubscriberNotification({
  subscriberName,
  subscriberEmail,
  planName,
}: {
  subscriberName: string
  subscriberEmail: string
  planName: string
}) {
  await resend.emails.send({
    from: `Woodgrain & Sawdust <${FROM}>`,
    to: FROM,
    subject: `New subscriber: ${subscriberName}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:32px 16px;background:#f5f0e8;font-family:Georgia,serif;">
  <table width="100%" style="max-width:480px;margin:0 auto;background:#fff;border-radius:10px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <tr><td>
      <p style="margin:0 0 4px;font-size:20px;font-weight:bold;color:#5c3d2e;">New subscriber!</p>
      <p style="margin:0 0 24px;font-size:13px;color:#9a8a7a;">Someone opted in while downloading a cut plan.</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #ede8de;font-size:13px;color:#9a8a7a;width:90px;">Name</td>
          <td style="padding:10px 0;border-bottom:1px solid #ede8de;font-size:14px;color:#3d2b1f;font-weight:bold;">${subscriberName}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #ede8de;font-size:13px;color:#9a8a7a;">Email</td>
          <td style="padding:10px 0;border-bottom:1px solid #ede8de;font-size:14px;color:#3d2b1f;font-weight:bold;">${subscriberEmail}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:13px;color:#9a8a7a;">Plan</td>
          <td style="padding:10px 0;font-size:14px;color:#3d2b1f;">${planName}</td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
    `.trim(),
  })
}
