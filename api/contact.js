export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, contact, message } = req.body ?? {};

  if (!name?.trim() || !contact?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // API Key auth — safer than Account SID + Auth Token.
  // TWILIO_SID is still needed for the URL (Account SID, starts with AC...).
  // TWILIO_API_KEY is the Key SID (starts with SK...).
  // TWILIO_API_SECRET is the secret shown once when you create the key.
  const accountSid  = process.env.TWILIO_SID;
  const apiKeySid   = process.env.TWILIO_API_KEY;
  const apiSecret   = process.env.TWILIO_API_SECRET;
  const fromPhone   = process.env.TWILIO_FROM;  // your Twilio number
  const toPhone     = process.env.MY_PHONE;     // your personal number

  const smsBody = [
    `📬 New site message`,
    `From: ${name.trim()}`,
    `Contact: ${contact.trim()}`,
    ``,
    message.trim(),
  ].join('\n');

  let twilioRes;
  try {
    twilioRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(`${apiKeySid}:${apiSecret}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: fromPhone,
          To:   toPhone,
          Body: smsBody,
        }),
      }
    );
  } catch (err) {
    console.error('Twilio fetch failed:', err);
    return res.status(500).json({ error: 'Network error reaching Twilio' });
  }

  if (twilioRes.ok) {
    return res.status(200).json({ ok: true });
  }

  const errData = await twilioRes.json().catch(() => ({}));
  console.error('Twilio error:', errData);
  return res.status(500).json({ error: 'Failed to send message' });
}
