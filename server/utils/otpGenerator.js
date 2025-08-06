const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

const generateOTP = () => {
  const otp = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false });
  return otp;
};

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { generateOTP, sendOTP };
