const express = require("express");
const router = express.Router();
const twiml = require("twilio").twiml;

/**
 * Handle incoming voice calls
 * POST /api/webhooks/voice
 */
router.post('/voice', (req, res) => {
  console.log('📞 Incoming voice call received');
  
  const response = new twiml.VoiceResponse();
  
  // Greet the caller
  response.say({
    voice: 'alice',
    language: 'en-US'
  }, 'Hello! Welcome to our service. Thank you for calling.');
  
  // Add a brief pause
  response.pause({ length: 1 });
  
  // Provide options
  response.say({
    voice: 'alice',
    language: 'en-US'
  }, 'Press 1 to speak with our team, or press 2 to receive information via SMS.');
  
  // Gather user input
  response.gather({
    input: 'dtmf',
    timeout: 10,
    action: '/api/webhooks/voice/choice',
    method: 'POST'
  }, (gather) => {
    gather.say({
      voice: 'alice',
      language: 'en-US'
    }, 'Please make your selection.');
  });
  
  // If no input is received, redirect to choice handler
  response.redirect('/api/webhooks/voice/choice');
  
  res.type('text/xml');
  res.send(response.toString());
});

/**
 * Handle voice call choices
 * POST /api/webhooks/voice/choice
 */
router.post('/voice/choice', (req, res) => {
  console.log('📞 Voice choice received:', req.body.Digits);
  
  const response = new twiml.VoiceResponse();
  const digits = req.body.Digits;
  
  if (digits === '1') {
    // Option 1: Speak with team
    response.say({
      voice: 'alice',
      language: 'en-US'
    }, 'Thank you for choosing to speak with our team. Please hold while we connect you.');
    
    // You can add a dial action here to connect to a real phone number
    // response.dial('+1234567890');
    
    response.say({
      voice: 'alice',
      language: 'en-US'
    }, 'Our team is currently busy. Please leave a message after the beep.');
    
    response.record({
      maxLength: 30,
      action: '/api/webhooks/voice/record',
      method: 'POST',
      transcribe: true
    });
    
  } else if (digits === '2') {
    // Option 2: Send SMS
    response.say({
      voice: 'alice',
      language: 'en-US'
    }, 'We will send you information via SMS. Please provide your phone number.');
    
    response.gather({
      input: 'speech dtmf',
      timeout: 10,
      action: '/api/webhooks/voice/sms',
      method: 'POST'
    }, (gather) => {
      gather.say({
        voice: 'alice',
        language: 'en-US'
      }, 'Please say or enter your phone number.');
    });
    
  } else {
    // Invalid choice
    response.say({
      voice: 'alice',
      language: 'en-US'
    }, 'Invalid selection. Please try again.');
    
    response.redirect('/api/webhooks/voice');
  }
  
  res.type('text/xml');
  res.send(response.toString());
});

/**
 * Handle voice recording
 * POST /api/webhooks/voice/record
 */
router.post('/voice/record', (req, res) => {
  console.log('📞 Voice recording received:', req.body.RecordingUrl);
  
  const response = new twiml.VoiceResponse();
  
  response.say({
    voice: 'alice',
    language: 'en-US'
  }, 'Thank you for your message. We will get back to you soon. Goodbye!');
  
  res.type('text/xml');
  res.send(response.toString());
});

/**
 * Handle SMS request from voice call
 * POST /api/webhooks/voice/sms
 */
router.post('/voice/sms', (req, res) => {
  console.log('📞 SMS request from voice call:', req.body);
  
  const response = new twiml.VoiceResponse();
  
  response.say({
    voice: 'alice',
    language: 'en-US'
  }, 'Thank you. We will send you information via SMS shortly. Goodbye!');
  
  // Here you would trigger an SMS to be sent
  // You can call your SMS service here
  
  res.type('text/xml');
  res.send(response.toString());
});

/**
 * Handle incoming SMS messages
 * POST /api/webhooks/sms
 */
router.post('/sms', (req, res) => {
  console.log('💬 Incoming SMS received:', req.body);
  
  const response = new twiml.MessagingResponse();
  const incomingMessage = req.body.Body?.toLowerCase() || '';
  const fromNumber = req.body.From;
  
  // Handle different message types
  if (incomingMessage.includes('hello') || incomingMessage.includes('hi')) {
    response.message('Hello! Welcome to our service. How can we help you today?');
  } else if (incomingMessage.includes('help')) {
    response.message('Here are some things you can do:\n- Type "info" for more information\n- Type "contact" for contact details\n- Type "pdf" to receive our PDF document');
  } else if (incomingMessage.includes('info')) {
    response.message('We provide comprehensive business solutions. Visit our website for more details or call us for a consultation.');
  } else if (incomingMessage.includes('contact')) {
    response.message('You can reach us at:\n📧 info@yourcompany.com\n📞 +1-234-567-8900\n🌐 www.yourcompany.com');
  } else if (incomingMessage.includes('pdf')) {
    response.message('We will send you our PDF document shortly. Please check your email or WhatsApp.');
    // Here you would trigger PDF sending logic
  } else {
    response.message('Thank you for your message. Type "help" to see available options.');
  }
  
  res.type('text/xml');
  res.send(response.toString());
});

/**
 * Handle SMS status updates
 * POST /api/webhooks/sms/status
 */
router.post('/sms/status', (req, res) => {
  console.log('📱 SMS status update:', req.body);
  
  const messageSid = req.body.MessageSid;
  const messageStatus = req.body.MessageStatus;
  
  // Log the status for tracking
  console.log(`Message ${messageSid} status: ${messageStatus}`);
  
  // You can add database logging here
  // You can also trigger follow-up actions based on status
  
  res.status(200).send('OK');
});

module.exports = router; 