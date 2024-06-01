import { login, twoFactorLogin } from './login';
import { updateSecurity, getSecurity } from './security';
import { startResetEmail, changeEmail } from './email';
import { changePassword, resetPassword, forgotPassword } from './password';
import { verifyResetOtp } from './otp';

export {
    forgotPassword,resetPassword,
    startResetEmail,
    changeEmail,
    updateSecurity,
    getSecurity,
    twoFactorLogin,
    verifyResetOtp,
    changePassword,
    login,
};
