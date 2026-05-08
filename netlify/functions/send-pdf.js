const nodemailer = require('nodemailer');

const EMAIL_USER = process.env.ELLIOTT_EMAIL || 'elliott@rtoadvisory.com';
const EMAIL_PASS = process.env.ELLIOTT_PASSWORD;

function sanitizeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function createTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });
}

async function sendEmail(transporter, to, subject, bodyHtml, pdfBuffer, attachmentName) {
  const mailOptions = {
    from: EMAIL_USER,
    to,
    subject,
    html: bodyHtml,
    attachments: pdfBuffer ? [{ filename: attachmentName, content: pdfBuffer, contentType: 'application/pdf' }] : []
  };
  await transporter.sendMail(mailOptions);
}

async function getPdfBuffer() {
  // Fetch PDF from the site's public assets
  const siteUrl = process.env.URL || process.env.DEPLOY_URL || 'https://rtoadvisory.com';
  const pdfPath = '/assets/white-papers/exit-readiness-gap.pdf';
  const pdfUrl = `${siteUrl}${pdfPath}`;
  
  console.log(`Fetching PDF from: ${pdfUrl}`);
  
  try {
    const response = await fetch(pdfUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const buffer = await response.arrayBuffer();
    console.log(`PDF fetched successfully: ${buffer.byteLength} bytes`);
    return Buffer.from(buffer);
  } catch (error) {
    console.error(`PDF fetch failed: ${error.message}`);
    throw new Error(`Could not fetch PDF: ${error.message}`);
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    if (!EMAIL_PASS) {
      throw new Error('Missing ELLIOTT_PASSWORD environment variable');
    }

    const body = JSON.parse(event.body);
    let { first_name, last_name, email, company, reader_type, reader_type_other } = body;

    if (!first_name || !last_name || !email || !company || !reader_type) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    if (!validateEmail(email)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email format' }) };
    }

    first_name = sanitizeHtml(first_name.trim());
    last_name = sanitizeHtml(last_name.trim());
    company = sanitizeHtml(company.trim());
    reader_type = sanitizeHtml(reader_type.trim());
    reader_type_other = reader_type_other ? sanitizeHtml(reader_type_other.trim()) : null;

    // Fetch PDF from deployed assets
    const pdfBuffer = await getPdfBuffer();

    const transporter = await createTransporter();

    // Send PDF to requester
    await sendEmail(
      transporter,
      email,
      'Your RTO Advisory White Paper: Exit Readiness Gap Assessment',
      `<p>Hi ${first_name},</p>
       <p>Thank you for your interest in the Exit Readiness Gap Assessment white paper.</p>
       <p>Your copy is attached. We look forward to connecting with you.</p>
       <p>Best regards,<br />RTO Advisory</p>`,
      pdfBuffer,
      'exit-readiness-gap.pdf'
    );

    // Notify Elliott of new lead
    await sendEmail(
      transporter,
      EMAIL_USER,
      `New White Paper Download: ${first_name} ${last_name}`,
      `<p>A new white paper was requested.</p>
       <ul>
         <li><strong>Name:</strong> ${first_name} ${last_name}</li>
         <li><strong>Email:</strong> ${email}</li>
         <li><strong>Company:</strong> ${company}</li>
         <li><strong>Reader Type:</strong> ${reader_type}${reader_type_other ? ` (${reader_type_other})` : ''}</li>
       </ul>`,
      null,
      null
    );

    return { statusCode: 200, body: JSON.stringify({ success: true }) };

  } catch (error) {
    console.error('send-pdf error:', error.message);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to send white paper. Please try again.' }) };
  }
};
