/**
 * Keeps the Woodgrain & Sawdust email list (one Resend segment, shared with the
 * main site) in sync with "Email me new free plans". Resend contacts are
 * account-wide, so an unsubscribe on either site covers both — it's one list.
 *
 * Needs RESEND_API_KEY and RESEND_SEGMENT_ID in the Convex env. Without them the
 * sync is skipped (logged), so dev deployments never touch the real list.
 */

const API = "https://api.resend.com";

/** Non-identifying stand-in for logs, e.g. "ar***@***.com". */
export function redactEmail(email: string): string {
  const [local, domain] = email.split("@");
  const tld = (domain ?? "").split(".").at(-1) ?? "";
  return `${local.slice(0, 2).padEnd(local.length, "*")}@***.${tld}`;
}

/** Subscribe (and add to the segment) or unsubscribe an email. Returns false if it didn't go through. */
export async function syncResendContact({
  email,
  name,
  subscribed,
}: {
  email: string;
  name?: string;
  subscribed: boolean;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_SEGMENT_ID;
  if (!apiKey || !segmentId) {
    console.error("RESEND_API_KEY or RESEND_SEGMENT_ID is not set — skipping email list sync");
    return false;
  }
  const headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const contact = `${API}/contacts/${encodeURIComponent(email)}`;
  const firstName = name?.trim().split(/\s+/)[0] || undefined;

  // Update first; create only if they aren't in Resend yet.
  const patch = await fetch(contact, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ unsubscribed: !subscribed, ...(firstName ? { first_name: firstName } : {}) }),
  });
  if (patch.status === 404) {
    if (!subscribed) return true; // not on the list: nothing to undo
    const create = await fetch(`${API}/contacts`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email, first_name: firstName, unsubscribed: false, segments: [{ id: segmentId }] }),
    });
    if (!create.ok) console.error(`Resend create contact failed (${create.status}) for ${redactEmail(email)}`);
    return create.ok;
  }
  if (!patch.ok) {
    console.error(`Resend update contact failed (${patch.status}) for ${redactEmail(email)}`);
    return false;
  }
  // Already a contact (maybe from the main site): make sure they're in the segment.
  if (subscribed) {
    const add = await fetch(`${contact}/segments/${segmentId}`, { method: "POST", headers });
    if (!add.ok) console.error(`Resend add-to-segment failed (${add.status}) for ${redactEmail(email)}`);
    return add.ok;
  }
  return true;
}
