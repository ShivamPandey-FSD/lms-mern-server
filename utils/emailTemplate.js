function generateVerificationOtpEmailTemplate(otpCode) {
  return `
  <div style="background-color:#f4f6f8; padding:40px 0; font-family:Arial, Helvetica, sans-serif;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.08); overflow:hidden;">
      
      <!-- Header -->
      <div style="background:#2f80ed; padding:20px; text-align:center;">
        <h1 style="margin:0; font-size:22px; color:#ffffff;">Email Verification</h1>
      </div>

      <!-- Body -->
      <div style="padding:30px;">
        <p style="font-size:16px; color:#333333; margin-bottom:16px;">
          Hello,
        </p>

        <p style="font-size:16px; color:#555555; line-height:1.6;">
          Thank you for signing up with <strong>Bookshelf</strong>.  
          To continue, please verify your email address using the code below:
        </p>

        <!-- OTP Box -->
        <div style="margin:30px 0; text-align:center;">
          <div style="
            display:inline-block;
            padding:14px 28px;
            font-size:26px;
            font-weight:bold;
            letter-spacing:4px;
            color:#2f80ed;
            border:2px dashed #2f80ed;
            border-radius:6px;
            background:#f7faff;">
            ${otpCode}
          </div>
        </div>

        <p style="font-size:14px; color:#555555;">
          This verification code is valid for <strong>15 minutes</strong>.  
          Please do not share this code with anyone.
        </p>

        <p style="font-size:14px; color:#777777; margin-top:20px;">
          If you did not request this email, you can safely ignore it.
        </p>

        <p style="font-size:14px; color:#333333; margin-top:30px;">
          Regards,<br>
          <strong>Bookshelf Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f4f6f8; padding:15px; text-align:center;">
        <p style="font-size:12px; color:#888888; margin:0;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>

    </div>
  </div>
  `;
}

function generateForgotPasswordEmailTemplate(resetPasswordUrl) {
  return `
  <div style="background-color:#f4f6f8; padding:40px 0; font-family:Arial, Helvetica, sans-serif;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.08); overflow:hidden;">
      
      <!-- Header -->
      <div style="background:#2f80ed; padding:20px; text-align:center;">
        <h1 style="margin:0; font-size:22px; color:#ffffff;">Reset Your Password</h1>
      </div>

      <!-- Body -->
      <div style="padding:30px;">
        <p style="font-size:16px; color:#333333; margin-bottom:16px;">
          Hello,
        </p>

        <p style="font-size:16px; color:#555555; line-height:1.6;">
          We received a request to reset the password for your <strong>Bookshelf</strong> account.
          Click the button below to create a new password.
        </p>

        <!-- Reset Button -->
        <div style="margin:30px 0; text-align:center;">
          <a href="${resetPasswordUrl}" 
            style="
              display:inline-block;
              padding:14px 32px;
              font-size:16px;
              font-weight:bold;
              color:#ffffff;
              background:#2f80ed;
              text-decoration:none;
              border-radius:6px;">
            Reset Password
          </a>
        </div>

        <!-- Fallback Link -->
        <p style="font-size:14px; color:#555555;">
          If the button doesn’t work, copy and paste this link into your browser:
        </p>

        <p style="font-size:14px; word-break:break-all;">
          <a href="${resetPasswordUrl}" style="color:#2f80ed;">
            ${resetPasswordUrl}
          </a>
        </p>

        <p style="font-size:14px; color:#555555; margin-top:20px;">
          This password reset link is valid for <strong>15 minutes</strong>.
          For security reasons, please do not share this link with anyone.
        </p>

        <p style="font-size:14px; color:#777777; margin-top:20px;">
          If you did not request a password reset, you can safely ignore this email.
        </p>

        <p style="font-size:14px; color:#333333; margin-top:30px;">
          Regards,<br>
          <strong>Bookshelf Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f4f6f8; padding:15px; text-align:center;">
        <p style="font-size:12px; color:#888888; margin:0;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>

    </div>
  </div>
  `;
}

module.exports = {
  generateVerificationOtpEmailTemplate,
  generateForgotPasswordEmailTemplate
};
