import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'hello@woodgrainandsawdust.com'
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://woodgrainandsawdust.com'
const BUY_ME_A_COFFEE_URL = 'https://buymeacoffee.com/woodgrainandsawdust'

export async function sendDownloadConfirmation({
  toName,
  toEmail,
  planName,
  planSlug,
  unsubscribeUrl,
}: {
  toName: string
  toEmail: string
  planName: string
  planSlug: string
  unsubscribeUrl: string
}) {
  const planUrl = `${SITE_URL}/plans/${encodeURIComponent(planSlug)}`

  await resend.emails.send({
    from: `Woodgrain & Sawdust <${FROM}>`,
    to: toEmail,
    subject: `Your "${planName}" cut plan is ready!`,
    headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>` },
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#5c3d2e;padding:32px 40px;text-align:center;">
            <p style="margin:0;font-size:22px;font-weight:bold;color:#f5f0e8;letter-spacing:0.5px;">Woodgrain &amp; Sawdust</p>
            <p style="margin:6px 0 0;font-size:13px;color:#c9a97a;">Free Woodworking Cut Plans</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 8px;font-size:16px;color:#3d2b1f;">Hi ${toName},</p>
            <p style="margin:0 0 24px;font-size:15px;color:#5a4a3a;line-height:1.6;">
              Thanks for downloading! Your <strong>${planName}</strong> cut plan is ready — head back to the plan page anytime to grab it again.
            </p>

            <div style="text-align:center;margin:0 0 28px;">
              <a href="${planUrl}"
                 style="display:inline-block;background:#d4851a;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;padding:14px 32px;border-radius:50px;">
                View Plan
              </a>
            </div>

            <hr style="border:none;border-top:1px solid #ede8de;margin:0 0 24px;" />

            <p style="margin:0 0 8px;font-size:14px;color:#5a4a3a;line-height:1.6;">
              If this plan saves you time or comes out better than expected, consider buying me a coffee — it helps keep the plans coming!
            </p>
            <div style="text-align:center;margin:0 0 4px;">
              <a href="${BUY_ME_A_COFFEE_URL}"
                 style="display:inline-block;color:#d4851a;font-size:14px;font-weight:bold;text-decoration:none;border:2px solid #d4851a;padding:10px 24px;border-radius:50px;">
                ☕ Buy Me a Coffee
              </a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f5f0e8;padding:20px 40px;text-align:center;">
            <p style="margin:0 0 8px;font-size:12px;color:#9a8a7a;">
              You're receiving this because you downloaded a free plan from
              <a href="${SITE_URL}" style="color:#d4851a;text-decoration:none;">woodgrainandsawdust.com</a>.
            </p>
            <p style="margin:0;font-size:11px;color:#b0a090;">
              <a href="${unsubscribeUrl}" style="color:#b0a090;">Unsubscribe from future emails</a>
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
