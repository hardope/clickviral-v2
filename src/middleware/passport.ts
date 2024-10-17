import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../apps/user/models/userModel";
import { JWT_SECRET } from "../utils/environment";
// import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";

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

const authUser = async (ws: any, req: any) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        ws.close(4001, 'Unauthorized');
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET)

        const user = await User.findById(decoded['id'])
        if (!user) {
            ws.close(4001, 'Unauthorized')
        }
        req.user = user
    } catch (error) {
        console.log(error)
        ws.close(4001, 'Invalid Token')
    }

}

export { passportConfig, authUser}