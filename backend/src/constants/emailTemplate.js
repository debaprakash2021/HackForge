export const otpEmailTemplate = (
  name,
  otp
) => {
  return `
    <div style="font-family:Arial;padding:20px">

      <h2>HackForge Email Verification</h2>

      <p>Hello ${name},</p>

      <p>Your verification code is:</p>

      <h1 style="letter-spacing:5px">
        ${otp}
      </h1>

      <p>
        This OTP will expire in
        10 minutes.
      </p>

      <p>
        Do not share this OTP
        with anyone.
      </p>

      <br>

      <p>
        Team HackForge
      </p>

    </div>
  `;
};

export const passwordResetTemplate = (
  name,
  otp
) => {
  return `
    <div style="font-family:Arial;padding:20px">

      <h2>Password Reset</h2>

      <p>Hello ${name},</p>

      <p>
        Use the OTP below to
        reset your password.
      </p>

      <h1 style="letter-spacing:5px">
        ${otp}
      </h1>

      <p>
        This OTP expires in
        10 minutes.
      </p>

      <p>
        Ignore this email if you
        didn't request it.
      </p>

    </div>
  `;
};