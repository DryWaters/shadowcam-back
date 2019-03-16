const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const database = require("./database/db");
const sql = require("./database/sql");

module.exports = passport => {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.DB_PASS;
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      return database.db
        .any(sql.users.findUser, [jwt_payload.email])
        .then(result => {
          if (result) {
            return done(null, result);
          } else {
            return done(null, false);
          }
        })
        .catch(err => {
          return done(err, false);
        });
    })
  );
};
