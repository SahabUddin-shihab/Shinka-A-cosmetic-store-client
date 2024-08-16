import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["error", "query"],
});

passport.use(
  new GoogleStrategy(
    {
      clientID: '291686626204-eur9603aphgid8esg58krrtm9buo6n6f.apps.googleusercontent.com', //process.env.GOOGLE_CLIENT_ID,
      clientSecret: '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',// process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://getway-client.vercel.app/google/callback', //process.env.callbackURL,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      const user = await prisma.user.findFirst({
        where: {
          email: profile.email,
        },
      });
      if (user) {
        return done(null, user);
      }

      const create_user = await prisma.user.create({
        data: {
          name: profile.name.givenName,
          email: profile.email,
          email_verified: profile.email_verified.toString(),
          is_organizer: 0,
          is_approved: 0,
          verified_token: null,
          password: "",
        },
      });

      return done(null, create_user);
    }
  )
);
