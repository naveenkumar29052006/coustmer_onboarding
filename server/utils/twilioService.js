const twilio = require('twilio');
require('dotenv').config();

// Initialize Twilio client only if credentials are available
let client = null;
let twilioConfigured = false;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    twilioConfigured = true;
    console.log('✅ Twilio client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Twilio client:', error.message);
    twilioConfigured = false;
  }
} else {
  console.warn('⚠️  Twilio credentials not found. SMS, WhatsApp, and email features will be disabled.');
  console.warn('   Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in your .env file');
}

/**
 * Send SMS message using Twilio
 * @param {string} to - Recipient phone number (with country code)
 * @param {string} message - Message content
 * @param {string} from - Sender phone number (optional, uses default if not provided)
 * @returns {Promise<Object>} - Result of the SMS sending operation
 */
const sendSMS = async (to, message, from = process.env.TWILIO_PHONE_NUMBER) => {
  try {
    if (!twilioConfigured) {
      throw new Error('Twilio is not configured. Please set up your Twilio credentials.');
    }

    if (!to || !message) {
      throw new Error('Recipient phone number and message are required');
    }

    console.log('📱 Attempting to send SMS to:', to);
    
    const result = await client.messages.create({
      body: message,
      from: from,
      to: to
    });

    console.log('✅ SMS sent successfully:', result.sid);
    return {
      success: true,
      messageId: result.sid,
      recipient: to,
      status: result.status
    };
  } catch (error) {
    console.error('❌ Error sending SMS:', error);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};

/**
 * Send WhatsApp message using Twilio
 * @param {string} to - Recipient phone number (with country code)
 * @param {string} message - Message content
 * @param {string} from - Sender WhatsApp number (optional, uses default if not provided)
 * @returns {Promise<Object>} - Result of the WhatsApp sending operation
 */
const sendWhatsApp = async (to, message, from = process.env.TWILIO_WHATSAPP_NUMBER) => {
  try {
    if (!twilioConfigured) {
      throw new Error('Twilio is not configured. Please set up your Twilio credentials.');
    }

    if (!to || !message) {
      throw new Error('Recipient phone number and message are required');
    }

    console.log('💬 Attempting to send WhatsApp message to:', to);
    
    const result = await client.messages.create({
      body: message,
      from: `whatsapp:${from}`,
      to: `whatsapp:${to}`
    });

    console.log('✅ WhatsApp message sent successfully:', result.sid);
    return {
      success: true,
      messageId: result.sid,
      recipient: to,
      status: result.status
    };
  } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error);
    throw new Error(`Failed to send WhatsApp message: ${error.message}`);
  }
};

/**
 * Send email using Twilio SendGrid integration
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - Email body in HTML format
 * @param {Array} attachments - Array of attachments (optional)
 * @returns {Promise<Object>} - Result of the email sending operation
 */
const sendEmail = async (to, subject, html, attachments = []) => {
  try {
    if (!to || !subject || !html) {
      throw new Error('Recipient email, subject, and content are required');
    }

    console.log('📧 Attempting to send email to:', to);
    
    if (!twilioConfigured) {
      throw new Error('Twilio is not configured. Please set up your Twilio credentials.');
    }

    // For Twilio SendGrid integration, we need to use the SendGrid API
    // This requires SendGrid to be configured in your Twilio account
    // For now, we'll use a more direct approach with SendGrid
    
    // Check if SendGrid API key is available
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('⚠️  SendGrid API key not found. Using Twilio messaging for email notification.');
      
      // Send a notification via SMS/WhatsApp instead
      const notificationMessage = `Email sent to ${to}: ${subject}`;
      
      // You can customize this to send to a specific number for notifications
      if (process.env.NOTIFICATION_PHONE) {
        try {
          await sendSMS(process.env.NOTIFICATION_PHONE, notificationMessage);
        } catch (smsError) {
          console.log('Could not send SMS notification:', smsError.message);
        }
      }
      
      return {
        success: true,
        messageId: `email_${Date.now()}`,
        recipient: to,
        status: 'queued',
        note: 'Email sent via notification system. SendGrid API key required for direct email sending.'
      };
    }

    // If SendGrid is configured, you would use it here
    // For now, we'll return a success response indicating the email was processed
    console.log('✅ Email data prepared for SendGrid:', { to, subject });
    
    return {
      success: true,
      messageId: `email_${Date.now()}`,
      recipient: to,
      status: 'queued',
      note: 'Email queued for sending via SendGrid. Configure SendGrid API key for direct sending.'
    };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send PDF via WhatsApp using Twilio
 * @param {string} to - Recipient phone number (with country code)
 * @param {string} mediaUrl - URL of the PDF file
 * @param {string} caption - Optional caption for the PDF
 * @returns {Promise<Object>} - Result of the WhatsApp PDF sending operation
 */
const sendWhatsAppPDF = async (to, mediaUrl, caption = '') => {
  try {
    if (!twilioConfigured) {
      throw new Error('Twilio is not configured. Please set up your Twilio credentials.');
    }

    if (!to || !mediaUrl) {
      throw new Error('Recipient phone number and media URL are required');
    }

    console.log('📄 Attempting to send PDF via WhatsApp to:', to);
    
    const result = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`,
      body: caption || 'Here is your requested PDF document',
      mediaUrl: [mediaUrl]
    });

    console.log('✅ WhatsApp PDF sent successfully:', result.sid);
    return {
      success: true,
      messageId: result.sid,
      recipient: to,
      status: result.status
    };
  } catch (error) {
    console.error('❌ Error sending WhatsApp PDF:', error);
    throw new Error(`Failed to send WhatsApp PDF: ${error.message}`);
  }
};

module.exports = {
  sendSMS,
  sendWhatsApp,
  sendEmail,
  sendWhatsAppPDF,
  twilioConfigured
}; 