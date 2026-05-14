const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const send2FACode = async (email, code) => {
  try {
    const { error } = await resend.emails.send({
      from: 'TopNews <noreply@topnews250.com>',
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>TopNews Verification</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #f97316; letter-spacing: 8px;">${code}</h1>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message);
    }

    console.log(`2FA code sent to ${email}`);
  } catch (err) {
    console.error('Error sending 2FA email:', err);
    throw err;
  }
};

module.exports = { send2FACode };