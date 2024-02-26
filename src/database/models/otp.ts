import mongoose, { Schema } from 'mongoose';

const otp = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    otp: { type: String, default: (Math.floor(100000 + Math.random() * 900000)) },
    purpose: { type: String, required: true, enum: ['register', 'password_reset', 'forgot_password', 'change_email']},
    created_at: { type: Date, default: Date.now },
});

const Otp = mongoose.model('Otp', otp);

export default Otp;