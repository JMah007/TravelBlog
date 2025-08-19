const user = require("../models/user"); 
const passport = require("../controllers/passport"); 
const { registerVal, loginVal } = require("../controllers/validate"); 

const bcrypt = require("bcrypt");


const authLogin = function (req, res, next) {
  const { error } = loginVal.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      console.log("user-connected being recieved from authController.js:");

      const userData = { username: user.username, _id: user._id };

      res.json({ success: true, user: { _id: user._id, username: user.username }, redirectTo: "/travelBlog/home" });

    });
  })(req, res, next);
};



const authRegister = async function (req, res) {
    const { username, password } = req.body;

    // Validate password
    const { error } = registerVal.validate(req.body);
    if (error) {
        return res.json({ success: false, message: error.details[0].message });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new user({ username, password: hashedPassword });

        await newUser.save();
        
        return res.json({ success: true, redirectTo: "/travelBlog/login" });
    } catch (error) {
        if (error.code === 11000) { // Duplicate username error
            return res.json({ success: false, message: "Username already exists. Please choose another one." });
        } else {
            return res.json({ success: false, message: "An unexpected error occurred. Please try again." });
        }
    }
};



  const authLogout = async function(req, res){
    
    req.logout((err) => {
      if (err) return res.status(500).json({ success: false, message: "Logout failed" });
  
      req.session.destroy(() => { 
        res.clearCookie("connect.sid"); 
        res.json({ success: true, redirectTo: "/travelBlog/login" }); 
      });
    });
  }

  const getInitialPage = function(req, res){
    res.render('layout');
  }

  const getRegisterPage = function(req, res){
    res.render("register");
  }

  const getLoginPage =  function(req, res){
    res.render("login");
  }
  
module.exports = { authLogin, authRegister, getInitialPage, getRegisterPage, getLoginPage, authLogout};