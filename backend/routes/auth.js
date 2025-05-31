const express = require('express');
const passport = require('passport');
const router = express.Router();

// Redirect to GitHub for authentication
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth callback
router.get('/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login',
    successRedirect: 'http://localhost:3000/dashboard'
  })
);

// Current user
router.get('/me', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).send({ user: null });
  res.send({ user: req.user });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
