const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

module.exports = (app) => {
  const Users = app.db.models.Users;
  const cfg = app.libs.config;
  const opts = {};
  opts.secretOrKey = "Nta$K_AP1";
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  const strategy = new JwtStrategy(opts, (payload, done) => {
    Users.findById(payload.id)
      .then((user) => {
        if (user) {
          return done(null, {
            id: user.id,
            email: user.email,
          });
        }
        return done(null, false);
      })
      .catch((error) => done(error, null));
  });
  passport.use(strategy);
  return {
    initialize: () => {
      return passport.initialize();
    },
    authenticate: () => {
      return passport.authenticate("jwt", cfg.jwtSession);
    },
  };
};
