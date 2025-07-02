const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Initialize SendGrid
let sendGridConfigured = false;

if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'your_actual_sendgrid_api_key_here') {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sendGridConfigured = true;
    console.log('✅ SendGrid email service initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize SendGrid:', error.message);
    sendGridConfigured = false;
  }
} else {
  console.warn('⚠️  SendGrid API key not found or not configured. Email features will be disabled.');
  sendGridConfigured = false;
}

/**
 * Send an email with PDF attachment using SendGrid
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - Email body in HTML format
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {string} filename - PDF filename
 * @returns {Promise<Object>} - Result of the email sending operation
 */
const sendEmailWithPDF = async (to, subject, html, pdfBuffer, filename = 'document.pdf') => {
  try {
    if (!sendGridConfigured) {
      throw new Error('SendGrid is not configured. Please set up your SENDGRID_API_KEY in the .env file');
    }

    if (!to || !subject || !html) {
      throw new Error('Recipient email, subject, and content are required');
    }

    console.log(`📧 Sending email with PDF to: ${to}`);

    const msg = {
      to: to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@yourdomain.com',
        name: 'Your Company Name'
      },
      subject: subject,
      html: html,
      attachments: [
        {
          content: pdfBuffer.toString('base64'),
          filename: filename,
          type: 'application/pdf',
          disposition: 'attachment'
        }
      ],
      trackingSettings: {
        clickTracking: {
          enable: true,
          enableText: true
        },
        openTracking: {
          enable: true
        }
      }
    };

    const response = await sgMail.send(msg);
    
    console.log(`✅ Email sent successfully! Message ID: ${response[0]?.headers['x-message-id']}`);
    
    return {
      success: true,
      messageId: response[0]?.headers['x-message-id'] || `email_${Date.now()}`,
      recipient: to,
      status: 'sent',
      provider: 'SendGrid',
      response: response[0]
    };

  } catch (error) {
    console.error('❌ Error sending email via SendGrid:', error.message);
    
    // Provide specific error messages for common issues
    if (error.response && error.response.body && error.response.body.errors) {
      const errors = error.response.body.errors;
      
      for (const err of errors) {
        if (err.message.includes('verified Sender Identity')) {
          throw new Error(`Sender email not verified. Please verify '${process.env.SENDGRID_FROM_EMAIL}' in SendGrid dashboard under Settings → Sender Authentication.`);
        } else if (err.message.includes('API key')) {
          throw new Error('Invalid SendGrid API key. Please check your SENDGRID_API_KEY in the .env file.');
        } else if (err.message.includes('permission')) {
          throw new Error('SendGrid API key does not have permission to send emails. Please create a new API key with "Mail Send" permissions.');
        }
      }
    }
    
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send a simple email without attachments
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - Email body in HTML format
 * @returns {Promise<Object>} - Result of the email sending operation
 */
const sendEmail = async (to, subject, html) => {
  try {
    if (!sendGridConfigured) {
      throw new Error('SendGrid is not configured. Please set up your SENDGRID_API_KEY in the .env file');
    }

    if (!to || !subject || !html) {
      throw new Error('Recipient email, subject, and content are required');
    }

    console.log(`📧 Sending email to: ${to}`);

    const msg = {
      to: to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@yourdomain.com',
        name: 'Your Company Name'
      },
      subject: subject,
      html: html
    };

    const response = await sgMail.send(msg);
    console.log(`✅ Email sent successfully! Message ID: ${response[0]?.headers['x-message-id']}`);
    
    return {
      success: true,
      messageId: response[0]?.headers['x-message-id'] || `email_${Date.now()}`,
      recipient: to,
      status: 'sent',
      provider: 'SendGrid'
    };

  } catch (error) {
    console.error('❌ Error sending email via SendGrid:', error.message);
    
    if (error.response && error.response.body && error.response.body.errors) {
      const errors = error.response.body.errors;
      
      for (const err of errors) {
        if (err.message.includes('verified Sender Identity')) {
          throw new Error(`Sender email not verified. Please verify '${process.env.SENDGRID_FROM_EMAIL}' in SendGrid dashboard under Settings → Sender Authentication.`);
        }
      }
    }
    
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Test SendGrid connection
 * @returns {Promise<boolean>} - Whether SendGrid is working
 */
const testSendGridConnection = async () => {
  try {
    if (!sendGridConfigured) {
      return false;
    }

    const testMsg = {
      to: 'test@example.com',
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@yourdomain.com',
        name: 'Test Sender'
      },
      subject: 'SendGrid Test',
      html: '<p>This is a test email to verify SendGrid connection.</p>'
    };

    await sgMail.send(testMsg);
    return true;
  } catch (error) {
    console.error('SendGrid connection test failed:', error.message);
    return false;
  }
};

module.exports = {
  sendEmail,
  sendEmailWithPDF,
  sendGridConfigured,
  testSendGridConnection
}; 