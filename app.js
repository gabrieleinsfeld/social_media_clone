const express = require("express");
const expressSession = require("express-session");

// Require needs for user authentication
const passport = require("passport");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("./db/prisma");

const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { ExtractJwt, Strategy: JwtStrategy } = require("passport-jwt");

// Creates express app
const app = express();

// Requires the use of .env file
require("dotenv").config();

// SESSION CONFIGURATION
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from the Authorization header as a Bearer token
      secretOrKey: process.env.JWT_SECRET, // The secret key to decode the JWT
    },
    async (jwtPayload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: jwtPayload.userId },
        });
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

// Starts cors for requests from different IP addresses
const cors = require("cors");
app.use(cors({ origin: "*" }));

// ROUTES BEGIN
const userRouter = require("./routes/userRouter");

app.get("/", (req, res) => {
  res.json({ message: "Hello" });
});

app.post("/log-in", async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !(await bcryptjs.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "5h",
  });

  // Send the token to the client
  res.json({ token, user });
});

app.get("/log-out", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/"); // Redirect to the homepage or login page after logout
  });
});

app.use("/user", passport.authenticate("jwt", { session: false }), userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
