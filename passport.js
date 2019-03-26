const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { db } = require("./database/db");
const sql = require("./database/sql").users;

module.exports = passport => {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.KEY;
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      return db
        .any(sql.findUserByEmail, { email: jwt_payload.email })
        .then(result => {
          if (result[0]) {
            return done(null, result[0]);
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
