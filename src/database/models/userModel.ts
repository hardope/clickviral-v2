import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    bio: { type: String, default: '' },
    password: { type: String, required: true },
    profileImage: { type: String, default: '' },
    coverImage: { type: String, default: '' },  
    date_joined: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    last_login: { type: Date, null: true, default: null},
    last_seen: { type: Date, null: true, default: null},
    is_active: { type: Boolean, default: false },
    is_admin: { type: Boolean, default: false },
    profile_type: { type: String, default: 'public' },
});

userSchema.pre('save', async function(next) {

    // Update the updated_at field
    this.updated_at = new Date();

    // Hash the password before saving the user
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(this.password, SALT_ROUNDS);
        this.password = hashedPassword;
        next();
    } catch (error) {
        return next(Error('Error hashing password'));
    }
});

userSchema.methods.comparePassword = async function(candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.__v;
    delete userObject.updated_at;
    delete userObject.last_login;
    delete userObject.is_active;
    delete userObject.is_admin;
    userObject.id = userObject._id;
    delete userObject._id;
    return userObject;
}

const User = mongoose.model('User', userSchema);

export default User;
