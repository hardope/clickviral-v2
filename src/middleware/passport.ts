import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../apps/user/models/userModel";
import { JWT_SECRET } from "../utils/environment";

const passportConfig = () => {
    passport.use(
        new Strategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: JWT_SECRET,
            },
            async (payload, done) => {
                try {
                    const user = await User.findById(payload.id);
                    if (!user) {
                        return done(null, false);
                    }
                    user.last_seen = new Date();
                    await user.save();
                    return done(null, user);
                } catch (error) {
                    return done(error, false);
                }
            }
        )
    )
}

export { passportConfig }