import mongoose, { Schema } from 'mongoose';
import { PASSWORD_SALT_ROUNDS } from '../../../utils/environment';
import bcrypt from 'bcrypt';
import { ASSET_HOST } from '../../../utils/environment';

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
        const hashedPassword = await bcrypt.hash(this.password, PASSWORD_SALT_ROUNDS);
        this.password = hashedPassword;
        next();
    } catch (error) {
        return next(Error('Error hashing password'));
    }
});

userSchema.pre("remove" as any, async function(this: any, next: any) {
    // Delete all images associated with the user
    await UserImage.deleteMany({ user_id: this._id });
    await securityPreferences.deleteMany({ user_id: this._id });
    next();
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
    userObject.id = userObject._id;
    delete userObject._id;
    userObject.profileImage && (userObject.profileImage = ASSET_HOST + userObject.profileImage);
    userObject.coverImage && (userObject.coverImage = ASSET_HOST + userObject.coverImage);
    return userObject;
}

const User = mongoose.model('User', userSchema);

const image_types = ['profileImage', 'coverImage'];

const userImageSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: image_types, required: true },
    url: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

userImageSchema.methods.toJSON = function() {
    console.log(this.url);
    const imageObject = this.toObject();
    delete imageObject.__v;
    delete imageObject.updated_at;
    imageObject.id = imageObject._id;
    delete imageObject._id;
    imageObject.url = ASSET_HOST + this.url;
    return imageObject;
}
const UserImage = mongoose.model('UserImage', userImageSchema);

const securityPreferencesSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    two_factor_auth: { type: Boolean, default: false },
    login_notifications: { type: Boolean, default: true },
    updated_at: { type: Date, default: Date.now },
});

securityPreferencesSchema.methods.toJSON = function() {
    const securityObject = this.toObject();
    delete securityObject.__v;
    delete securityObject.updated_at;
    securityObject.id = securityObject._id;
    delete securityObject._id;
    return securityObject;
}

const securityPreferences = mongoose.model('SecurityPreferences', securityPreferencesSchema);

export { User, UserImage, securityPreferences, userSchema };
