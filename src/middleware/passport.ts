import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../database/models/userModel";

const passportConfig = () => {
    passport.use(
        new Strategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: process.env.JWT_SECRET ||"secret",
            },
            async (payload, done) => {
                try {
                    const user = await User.findById(payload.id);
                    if (!user) {
                        return done(null, false);
                    }
                    return done(null, user);
                } catch (error) {
                    return done(error, false);
                }
            }
        )
    )
}

export { passportConfig }