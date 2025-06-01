import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';

passport.use(new GitHubStrategy({
  clientID: 'Ov23lixVqBoP3pVnLxIJ',
  clientSecret: 'b8c69292a322fa2540d26c3037b4f69fc57ff3e4',
  callbackURL: '/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '';
    const avatarUrl = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '';

    let user = await User.findOne({ githubId: profile.id });
    console.log("email"+email);
    if (!user) {
      user = await User.create({
        githubId: profile.id,
        username: profile.username,
        email: email,
        avatarUrl: avatarUrl,
      });
    } else {
      if (user.email !== email || user.avatarUrl !== avatarUrl) {
        user.email = email;
        user.avatarUrl = avatarUrl;
        await user.save();
      }
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));


passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
