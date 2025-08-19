const express = require("express");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const cors = require("cors");
const MongoStore = require("connect-mongo"); 
const authController = require("./controllers/authController");
const { Server } = require("socket.io");

const activeUsers = new Set(); 
const app = express();
const server = app.listen(3001, () => {
  console.log("Listening on port 3001");
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  socket.on("user-connected", (user) => {
    activeUsers.add(user.username);
    io.emit("update-active-users", Array.from(activeUsers));
  });

  socket.on("user-disconnected", (user) => {
    activeUsers.delete(user.username);
    io.emit("update-active-users", Array.from(activeUsers));
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});


app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));


app.use(session({
  secret: "IY7OafRgninlyL3l",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: "mongodb+srv://jaedenmah:IY7OafRgninlyL3l@cluster0.t24tfv3.mongodb.net/users?retryWrites=true&w=majority",
    collectionName: "sessions"
  }),
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: "lax"
  }
}));


app.use(passport.initialize());
app.use(passport.session());


app.use(flash());


app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success");
  res.locals.error_msg = req.flash("error");
  next();
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static("public"));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  user.findById(id, (err, user) => {
    done(err, user);
  });
});

app.get("/travelBlog/session", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ success: true, user: { _id: req.user._id, username: req.user.username } });

  } else {
    res.json({ success: false });
  }
});



app.post("/travelBlog/login", authController.authLogin);
app.post("/travelBlog/register", authController.authRegister);


const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog");

app.use("/travelBlog", authRoutes);
app.use("/travelBlog/blogs", blogRoutes);


mongoose.connect("mongodb+srv://jaedenmah:IY7OafRgninlyL3l@cluster0.t24tfv3.mongodb.net/users?retryWrites=true&w=majority")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));
  
