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
                  If this plan saves you some time (or just comes out awesome), consider buying me a coffee — it helps keep the free plans coming!
                </p>
                <div style="text-align:center;">
                  <a href="${BUY_ME_A_COFFEE_URL}"
                     style="display:inline-block;color:#d4851a;font-size:14px;font-weight:bold;text-decoration:none;border:2px solid #d4851a;padding:10px 26px;border-radius:50px;">
                    ☕ Buy Me a Coffee
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
