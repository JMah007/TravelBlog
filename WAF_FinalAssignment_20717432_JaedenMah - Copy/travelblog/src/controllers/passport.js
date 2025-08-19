const passport = require("passport"); 
const LocalStrategy = require("passport-local").Strategy;
const user = require("../models/user"); // Import User model
const bcrypt = require("bcrypt");


// Local Strategy
passport.use(
  new LocalStrategy({ usernameField: "username", passwordField: "password" }, async (username, password, done) => {
    try {
      const foundUser = await user.findOne({ username });
      if (!foundUser) return done(null, false, { message: "User not found!" });

      const isMatch = await bcrypt.compare(password, foundUser.password);
      if (!isMatch) return done(null, false, { message: "Incorrect password!" });

      return done(null, foundUser); 
    } catch (error) {
      return done(error);
    }
  })
);


// Serialize & Deserialize User 
passport.serializeUser((user, done) => {
  console.log("Serializing User:", user.id); 
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
      console.log("Deserializing User ID:", id);
      const foundUser = await user.findById(id);

      if (!foundUser) {
          console.log("Failed to deserialize user");
          return done(null, false);
      }

      console.log("Deserialized User:", foundUser); 
      done(null, foundUser);
  } catch (error) {
      done(error, null);
  }
});



module.exports = passport;
