const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const { sendSMS, sendWhatsApp, sendWhatsAppPDF } = require('../utils/twilioService');
const { sendEmailWithPDF, sendEmail, sendGridConfigured } = require('../utils/emailService');

/**
 * Test email endpoint
 * POST /api/email/test
 */
router.post('/test', async (req, res) => {
  try {
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Recipient email is required'
      });
    }

    if (!sendGridConfigured) {
      return res.status(500).json({
        success: false,
        message: 'SendGrid is not configured'
      });
    }

    console.log('🧪 Testing email to:', to);

    const testResult = await sendEmail(
      to,
      'Test Email - PDF Service',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2c3e50;">Test Email</h2>
          <p>This is a test email to verify that SendGrid is working properly.</p>
          <p>If you receive this email, the email service is configured correctly.</p>
          <p>Time sent: ${new Date().toLocaleString()}</p>
        </div>
      `
    );

    res.status(200).json({
      success: true,
      message: 'Test email sent successfully',
      data: testResult
    });

  } catch (error) {
    console.error('❌ Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message
    });
  }
});

/**
 * Send PDF via email using SendGrid
 * POST /api/email/send-pdf
 */
router.post('/send-pdf', async (req, res) => {
  try {
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Recipient email is required'
      });
    }

    if (!sendGridConfigured) {
      return res.status(500).json({
        success: false,
        message: 'Email service is not configured. Please set up SendGrid API key.',
        error: 'SendGrid not configured'
      });
    }

    // Read PDF file
    const pdfPath = path.join(__dirname, '..', 'public', 'book.pdf');
    console.log('📄 Reading PDF file...');
    
    try {
      await fs.access(pdfPath);
    } catch (err) {
      return res.status(404).json({
        success: false,
        message: 'PDF file not found on server'
      });
    }

    const pdfBuffer = await fs.readFile(pdfPath);
    console.log(`📄 PDF loaded (${pdfBuffer.length} bytes)`);

    const emailContent = {
      to,
      subject: 'Your Requested PDF Document',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2c3e50; margin-bottom: 20px;">Your PDF Document</h2>
          <p style="color: #34495e; line-height: 1.6;">Hello,</p>
          <p style="color: #34495e; line-height: 1.6;">Please find your requested PDF document attached to this email.</p>
          <p style="color: #34495e; line-height: 1.6;">If you have any questions, please don't hesitate to contact us.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #7f8c8d; font-size: 14px;">Best regards,<br>Your Team</p>
          </div>
        </div>
      `
    };

    const result = await sendEmailWithPDF(
      emailContent.to,
      emailContent.subject,
      emailContent.html,
      pdfBuffer,
      'book.pdf'
    );

    res.status(200).json({
      success: true,
      message: 'Email sent successfully via SendGrid',
      recipient: to,
      data: result
    });

  } catch (error) {
    console.error('❌ Error in send-pdf route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
});

/**
 * Send SMS message using Twilio
 * POST /api/email/send-sms
 */
router.post('/send-sms', async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        success: false,
        message: 'Recipient phone number and message are required'
      });
    }

    console.log('📱 Sending SMS to:', to);
    const result = await sendSMS(to, message);

    res.status(200).json({
      success: true,
      message: 'SMS sent successfully',
      recipient: to,
      data: result
    });

  } catch (error) {
    console.error('❌ Error in send-sms route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send SMS',
      error: error.message
    });
  }
});

/**
 * Send WhatsApp message using Twilio
 * POST /api/email/send-whatsapp
 */
router.post('/send-whatsapp', async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        success: false,
        message: 'Recipient phone number and message are required'
      });
    }

    console.log('💬 Sending WhatsApp message to:', to);
    const result = await sendWhatsApp(to, message);

    res.status(200).json({
      success: true,
      message: 'WhatsApp message sent successfully',
      recipient: to,
      data: result
    });

  } catch (error) {
    console.error('❌ Error in send-whatsapp route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send WhatsApp message',
      error: error.message
    });
  }
});

/**
 * Send PDF via WhatsApp using Twilio
 * POST /api/email/send-whatsapp-pdf
 */
router.post('/send-whatsapp-pdf', async (req, res) => {
  try {
    const { to, mediaUrl, caption } = req.body;

    if (!to || !mediaUrl) {
      return res.status(400).json({
        success: false,
        message: 'Recipient phone number and media URL are required'
      });
    }

    console.log('📄 Sending PDF via WhatsApp to:', to);
    const result = await sendWhatsAppPDF(to, mediaUrl, caption);

    res.status(200).json({
      success: true,
      message: 'WhatsApp PDF sent successfully',
      recipient: to,
      data: result
    });

  } catch (error) {
    console.error('❌ Error in send-whatsapp-pdf route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send WhatsApp PDF',
      error: error.message
    });
  }
});

module.exports = router;
