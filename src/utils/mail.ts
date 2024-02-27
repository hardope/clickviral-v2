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

const activateAccount = async (user: any): Promise<Boolean> => {

    var otp;
    
    otp = await Otp.findOne({ user_id: user._id, purpose: 'register' });

    if (!otp) {
        otp = await Otp.create({ user_id: user._id, purpose: 'register' });
    }

    const text = `Hi ${user.name},\nVerify Your Email Address using this OTP: ${otp.otp}\n\nIf you didn't request this, please ignore this email.\nClickViral Team`;
    const html = `<p>Hi ${user.first_name},</p><p>Verify Your Email Address using this OTP: <strong>${otp.otp}</strong></p><p>If you didn't request this, please ignore this email.</p><p>ClickViral Team</p>`;

    await sendMail(user.email, 'ClickVial - Activate your account', text, html);

    return true;

}

const resetPassword = async (user: any): Promise<Boolean> => {

    var otp;

    otp = await Otp.findOne({ user_id: user.id, purpose: 'forgot_password' });

    if (!otp) {
        otp = await Otp.create({ user_id: user.id, purpose: 'forgot_password' });
    }

    const text = `Hi ${user.name},\nReset Your Password using this OTP: ${otp.otp}\n\nIf you didn't request this, please ignore this email.\nClickViral Team`;
    const html = `<p>Hi ${user.first_name},</p><p>Reset Your Password using this OTP: <strong>${otp.otp}</strong></p><p>If you didn't request this, please ignore this email.</p><p>ClickViral Team</p>`;

    await sendMail(user.email, 'ClickViral - Reset your password', text, html);

    return true;

}

const resetEmail = async (user: any, newEmail: string): Promise<Boolean> => {

    var otp;

    Otp.deleteMany({ user_id: user.id, purpose: 'change_email' });
    
    otp = await Otp.create({ user_id: user.id, purpose: 'change_email', additional_data: JSON.stringify({ new_email: newEmail, new_email_otp: (Math.floor(100000 + Math.random() * 900000)) }) });

    var oldEMailText = `Hi ${user.name},\nUse This OTP to verify your old email address: ${otp.otp}\n\nIf you didn't request this, please ignore this email.\nClickViral Team`;
    var oldEmailHtml = `<p>Hi ${user.first_name},</p><p>Use This OTP to verify your old email address: <strong>${otp.otp}</strong></p><p>If you didn't request this, please ignore this email.</p><p>ClickViral Team</p>`;

    await sendMail(user.email, 'ClickVial - Verify your old email address', oldEMailText, oldEmailHtml);

    if (!otp.additional_data) {
        otp.additional_data = JSON.stringify({ new_email: newEmail, new_email_otp: (Math.floor(100000 + Math.random() * 900000)) });
        await otp.save();
    }

    var additional_data = JSON.parse(otp.additional_data);

    var newEmailText = `Hi ${user.name},\nUse This OTP to verify your new email address: ${additional_data.new_email_otp}\n\nIf you didn't request this, please ignore this email.\nClickViral Team`;
    var newEmailHtml = `<p>Hi ${user.first_name},</p><p>Use This OTP to verify your new email address: <strong>${additional_data.new_email_otp}</strong></p><p>If you didn't request this, please ignore this email.</p><p>ClickViral Team</p>`;

    await sendMail(newEmail, 'ClickVial - Verify your new email address', newEmailText, newEmailHtml);

    return true;
}

export { sendMail, activateAccount, resetPassword, resetEmail };