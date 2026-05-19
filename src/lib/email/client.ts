import { Resend } from 'resend';

const FROM_EMAIL = process.env.EMAIL_FROM ?? 'ordini@canapastore.it';

// Lazy-init to avoid crash when RESEND_API_KEY is not set (e.g. during build)
let _resend: Resend | null = null;
function getResendClient(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.warn('[Email] RESEND_API_KEY not set — emails will be logged but not sent');
      // Return a stub that logs instead of sending
      return { emails: { send: async (opts: unknown) => { console.log('[Email] Skipped (no API key):', opts); return { data: null, error: null }; } } } as unknown as Resend;
    }
    _resend = new Resend(key);
  }
  return _resend;
}

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
    if (error) { console.error('[Email] Send error:', error); return false; }
    return true;
  } catch (err) {
    console.error('[Email] Exception:', err);
    return false;
  }
}
