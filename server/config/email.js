const nodemailer = require('nodemailer');

/**
 * Email transporter setup.
 *
 * Set EMAIL_SERVICE in .env to one of:
 *   'gmail'    → Gmail SMTP (requires App Password — NOT your normal password)
 *   'outlook'  → Outlook / Hotmail
 *   'custom'   → any SMTP server (also set SMTP_HOST, SMTP_PORT, SMTP_SECURE)
 *   (unset)    → Demo mode — logs emails to console, no sending
 *
 * For Gmail App Password:
 *   1. Enable 2-Factor Auth on your Google account
 *   2. Go to myaccount.google.com → Security → App Passwords
 *   3. Generate an App Password for "Mail"
 *   4. Copy it into EMAIL_PASS in your .env (no spaces)
 */

const createTransporter = () => {
  const service = process.env.EMAIL_SERVICE;

  if (!service || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('📧 Email: DEMO mode — emails will be logged to console.');
    console.log('   To enable real emails, set EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS in .env\n');
    return null; // signals demo mode
  }

  let transportConfig;

  if (service === 'gmail') {
    transportConfig = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Must be a Gmail App Password
      },
    };
  } else if (service === 'outlook') {
    transportConfig = {
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { ciphers: 'SSLv3' },
    };
  } else if (service === 'custom') {
    transportConfig = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };
  } else {
    console.warn(`⚠️  Unknown EMAIL_SERVICE: "${service}". Falling back to demo mode.`);
    return null;
  }

  const transporter = nodemailer.createTransport(transportConfig);

  // Verify connection at startup
  transporter.verify((error) => {
    if (error) {
      console.error(`❌ Email connection failed (${service}):`, error.message);
      console.log('   Check your EMAIL_USER, EMAIL_PASS, and Gmail App Password setup.');
    } else {
      console.log(`✅ Email connected via ${service} (${process.env.EMAIL_USER})`);
    }
  });

  return transporter;
};

// Singleton transporter
const transporter = createTransporter();

const sendEmail = async ({ to, subject, text, html }) => {
  // === DEMO MODE — log to console ===
  if (!transporter) {
    console.log('\n📬 ══════════ EMAIL NOTIFICATION (DEMO) ══════════');
    console.log(`  To:      ${to}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Body:    ${text || '(HTML email)'}`);
    console.log('═════════════════════════════════════════════════\n');
    return { messageId: `demo-${Date.now()}` };
  }

  // === REAL EMAIL ===
  try {
    const info = await transporter.sendMail({
      from: `"JobBoard India" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h2 style="color:#3b82f6;">💼 JobBoard India</h2>
        <p>${(text || '').replace(/\n/g, '<br>')}</p>
        <hr style="border:1px solid #e5e7eb;margin:24px 0;"/>
        <p style="color:#9ca3af;font-size:12px;">
          JobBoard India — Connecting talent with opportunity<br/>
          <a href="http://localhost:5173" style="color:#3b82f6;">jobboard.in</a>
        </p>
      </div>`,
    });
    console.log(`✅ Email sent to ${to} [${info.messageId}]`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    // Don't throw — email failure should not break the app
  }
};

module.exports = sendEmail;

