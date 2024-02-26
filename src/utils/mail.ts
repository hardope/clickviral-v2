import nodemailer, { SentMessageInfo } from 'nodemailer';
import { config } from 'dotenv';
import Otp from '../database/models/otp';

config();

if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP configuration is missing');
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

const sendMail = async (to: string, subject: string, text: string, html: string): Promise<SentMessageInfo> => {

    var mailOptions = {
        from: process.env.SMTP_USER,
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    return await transporter.sendMail(mailOptions);
}

const ActivateAccount = async (user: any): Promise<Boolean> => {

    var otp;
    
    otp = await Otp.findOne({ user_id: user._id, purpose: 'register' });

    if (!otp) {
        otp = await Otp.create({ user_id: user._id, purpose: 'register' });
    }

    const text = `Hi ${user.name},\nVerify Your Email Address using this OTP: ${otp.otp}\n\nIf you didn't request this, please ignore this email.\nClickViral Team`;
    const html = `<p>Hi ${user.first_name},</p><p>Verify Your Email Address using this OTP: <strong>${otp.otp}</strong></p><p>If you didn't request this, please ignore this email.</p><p>ClickViral Team</p>`;

    await sendMail(user.email, 'Activate your account', text, html);

    return true;

}

export { sendMail, ActivateAccount };