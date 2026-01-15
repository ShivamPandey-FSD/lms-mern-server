const { generateVerificationOtpEmailTemplate } = require('./emailTemplate');
const sendEmail = require('./sendEmail');

async function sendVerificationCode(verificatonCode, email, res) {
 try {
  const message = await generateVerificationOtpEmailTemplate(verificatonCode);
  await sendEmail({
   email,
   subject: 'Verificaton Code (BookShelf LMS)',
   message
  });
  res.status(200).json({
   success: true,
   message: 'Verification Code sent successfully'
  })
 } catch (error) {
  return res.status(500).json({
   success: false,
   message: 'Verification code failed to send'
  })
 }
}

module.exports = sendVerificationCode;