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
    from: `"Elliott Culp" <${EMAIL_USER}>`,
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
  const pdfPath = '/assets/white-papers/exit-readiness-gap-2026-q2.pdf';
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
    let { first_name, last_name, email, company, reader_type, reader_type_other, pdf_url } = body;

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
    pdf_url = pdf_url ? String(pdf_url).trim() : '';

    let parsedPdfUrl = null;
    if (pdf_url) {
      try {
        parsedPdfUrl = new URL(pdf_url);
      } catch (_error) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid PDF URL' }) };
      }

      if (!['http:', 'https:'].includes(parsedPdfUrl.protocol)) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid PDF URL protocol' }) };
      }
    }

    let pdfBuffer = null;
    let attachmentName = null;

    // Always attach the PDF (Adobe URL flow has been retired across the site).
    pdfBuffer = await getPdfBuffer();
    attachmentName = 'The-Exit-Readiness-Gap-RTO-Advisory-2026-Q2.pdf';

    const BODY_COLOR = '#7A746C';
    const BRAND_COLOR = '#0F2E2A';
    const FONT_BODY = "Calibri, Arial, sans-serif";
    const FONT_SERIF = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
    const LOGO_URL = 'https://rtoadvisory.com/assets/images/RTO_LOGO_CLEANED_UP.png';
    const SITE_URL = 'https://rtoadvisory.com/';
    const CALENDLY_URL = 'https://calendly.com/elliott-rtoadvisory/30min?month=2026-05';

    const requesterHtml = `<div style="font-family:${FONT_BODY};font-size:11pt;line-height:1.4;color:${BODY_COLOR};">
  <p style="margin:0 0 12pt 0;">Hi ${first_name},</p>
  <p style="margin:0 0 12pt 0;">Congratulations are in order. Seriously.</p>
  <p style="margin:0 0 12pt 0;">You have taken the first step many business owners fail to take; you are actively participating in planning your exit.</p>
  <p style="margin:0 0 12pt 0;">Attached is your copy of <u style="color:${BRAND_COLOR};">The Exit Readiness Gap: Why 75% of Business Owners Are Unprepared (And What It's Costing Them)</u>.</p>
  <p style="margin:0 0 12pt 0;">Most owners assume the value they've built will translate cleanly when it's time to exit. The data says otherwise. The paper walks through where these gaps typically open, what they cost owners in real dollars, and the steps you can take to close those gaps, before a transaction is on the table.</p>
  <p style="margin:0 0 6pt 0;">A few ways readers most often use the white paper:</p>
  <ul style="margin:0 0 12pt 24pt;padding:0;color:${BODY_COLOR};">
    <li style="margin:0 0 4pt 0;">As a personal benchmark before any sale conversation</li>
    <li style="margin:0 0 4pt 0;">To frame a board or family discussion about timing</li>
    <li style="margin:0 0 4pt 0;">As the starting point for a focused readiness review</li>
  </ul>
  <p style="margin:0 0 18pt 0;">If you would like to discuss how this applies to your situation, simply reply to this email or <a href="${CALENDLY_URL}" style="color:${BRAND_COLOR};">book a free 30-minute consultation</a> to discuss your situation.</p>
  <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background:#ffffff;">
    <tr>
      <td valign="top" style="padding:6pt 12pt 6pt 0;width:104px;">
        <a href="${SITE_URL}" style="text-decoration:none;"><img src="${LOGO_URL}" alt="RTO Advisory" width="90" height="90" style="display:block;border:0;outline:none;width:90px;height:90px;" /></a>
      </td>
      <td valign="top" style="padding:6pt 0 6pt 6pt;">
        <div style="border-bottom:1px solid ${BRAND_COLOR};padding-bottom:2pt;margin-bottom:4pt;">
          <span style="font-family:${FONT_SERIF};font-size:12pt;color:${BRAND_COLOR};letter-spacing:0.04em;">ELLIOTT J.&nbsp;CULP</span>
        </div>
        <div style="font-family:${FONT_SERIF};font-size:10.5pt;color:#000000;margin-bottom:6pt;letter-spacing:0.02em;">FOUNDER | RTO ADVISORY</div>
        <div style="font-family:${FONT_BODY};font-size:10.5pt;margin-bottom:6pt;">
          <a href="mailto:elliott@rtoadvisory.com" style="color:${BRAND_COLOR};text-decoration:none;">elliott@rtoadvisory.com</a>
          <span style="color:#000000;">&nbsp;|&nbsp;</span>
          <a href="${SITE_URL}" style="color:${BRAND_COLOR};text-decoration:none;">rtoadvisory.com</a>
        </div>
        <div style="font-family:${FONT_SERIF};font-size:12pt;font-style:italic;color:${BRAND_COLOR};line-height:1.2;">Maximize Ownership Return</div>
        <div style="font-family:${FONT_SERIF};font-size:12pt;font-style:italic;color:${BRAND_COLOR};line-height:1.2;">Protect Your People | Preserve Your Culture</div>
      </td>
    </tr>
  </table>
</div>`;

    const transporter = await createTransporter();

    // Send PDF to requester
    await sendEmail(
      transporter,
      email,
      'Your white paper is attached: The Exit Readiness Gap',
      requesterHtml,
      pdfBuffer,
      attachmentName
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
         <li><strong>Source page:</strong> ${pdf_url ? sanitizeHtml(pdf_url) : '(not provided)'}</li>
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
