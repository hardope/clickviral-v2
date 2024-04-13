import mongoose, { Schema } from 'mongoose';

const otp = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    otp: { type: String, default: (Math.floor(100000 + Math.random() * 900000)) },
    purpose: { type: String, required: true, enum: ['register', 'password_reset', 'forgot_password', 'change_email', 'login']},
    created_at: { type: Date, default: Date.now },
    additional_data: { type: String }
});

otp.pre('save', function(next: any) {
    if (this.isNew) {
        this.otp = `${(Math.floor(100000 + Math.random() * 900000))}`;
    }
    next();
});

const Otp = mongoose.model('Otp', otp);

export default Otp;