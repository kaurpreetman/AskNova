const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('./models/User');
require('dotenv').config();

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: '/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ githubId: profile.id });
    if (existingUser) return done(null, existingUser);

    const newUser = await User.create({
      githubId: profile.id,
      username: profile.username,
      email: profile.emails?.[0]?.value || '',
      avatarUrl: profile.photos?.[0]?.value || ''
    });
    done(null, newUser);
  } catch (err) {
    done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
