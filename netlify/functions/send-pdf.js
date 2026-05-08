const nodemailer = require('nodemailer');

const TENANT_ID = process.env.AZURE_TENANT_ID;
const CLIENT_ID = process.env.AZURE_CLIENT_ID;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;
const SEND_FROM = 'elliott@rtoadvisory.com';

async function getAccessToken() {
  const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope: 'https://outlook.office365.com/.default'
  });

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token request failed: ${err}`);
  }

  const data = await res.json();
  return data.access_token;
}

async function createTransporter(accessToken) {
  return nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
      type: 'OAuth2',
      user: SEND_FROM,
      accessToken
    }
  });
}

async function sendEmail(transporter, to, subject, bodyHtml, pdfBuffer, attachmentName) {
  const mailOptions = {
    from: SEND_FROM,
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
  const pdfPath = encodeURI('/assets/white-papers/The Exit Readiness Gap Why 75% of Business Owners Are Unprepared (And What It\'s Costing Them).pdf');
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
    const body = JSON.parse(event.body);
    const { first_name, last_name, email, company, reader_type, reader_type_other } = body;

    if (!first_name || !last_name || !email || !company || !reader_type) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    // Fetch PDF from deployed assets
    const pdfBuffer = await getPdfBuffer();

    const accessToken = await getAccessToken();
    const transporter = await createTransporter(accessToken);

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
      'The Exit Readiness Gap Why 75% of Business Owners Are Unprepared (And What It\'s Costing Them).pdf'
    );

    // Notify Elliott of new lead
    await sendEmail(
      transporter,
      SEND_FROM,
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


// Create transporter using Office 365
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secureConnection: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    ciphers: 'SSLv3'
  }
});

exports.handler = async (event) => {
  // Only handle POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const { first_name, last_name, email, company, reader_type, reader_type_other } = body;

    // Validate required fields
    if (!first_name || !last_name || !email || !company || !reader_type) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Read the PDF file
    const pdfPath = path.join(process.cwd(), 'assets/white-papers/exit-readiness-gap.pdf');
    const pdfBuffer = fs.readFileSync(pdfPath);

    // Prepare email to the requester
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your RTO Advisory White Paper: Exit Readiness Gap Assessment',
      html: `
        <p>Hi ${first_name},</p>
        <p>Thank you for your interest in RTO Advisory's white paper on the Exit Readiness Gap Assessment.</p>
        <p>Your white paper is attached. We look forward to connecting with you soon.</p>
        <p>Best regards,<br />RTO Advisory Team</p>
      `,
      attachments: [
        {
          filename: 'exit-readiness-gap.pdf',
          content: pdfBuffer
        }
      ]
    };

    // Send email to requester
    await transporter.sendMail(mailOptions);

    // Also notify Elliott of the new lead
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'elliott@rtoadvisory.com',
      subject: `New White Paper Download: ${first_name} ${last_name}`,
      html: `
        <p>A new white paper was requested.</p>
        <ul>
          <li><strong>Name:</strong> ${first_name} ${last_name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Company:</strong> ${company}</li>
          <li><strong>Reader Type:</strong> ${reader_type}${reader_type_other ? ` (${reader_type_other})` : ''}</li>
        </ul>
      `
    });

    // Also log to Netlify Forms for your dashboard
    console.log(`PDF gate submission: ${first_name} ${last_name}, ${email}, ${company}, ${reader_type}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'White paper sent to your email' })
    };
  } catch (error) {
    console.error('PDF send error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send white paper. Please try again.' })
    };
  }
};
