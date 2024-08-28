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
const commentRouter = require("./routes/commentRouter");
const postRouter = require("./routes/postRouter");

app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace (for debugging)
  console.log("SUDUSHADIAUSHIUASHDIUHSAFIUASHF", sisdi);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});
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

app.post("/sign-up", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const hashedPassword = bcryptjs.hash(
      password,
      10,
      async (err, hashedPassword) => {
        if (err) {
          console.error(err);
        } else {
          const user = await prisma.user.create({
            data: {
              email,
              username,
              password: hashedPassword,
            },
          });
          res.json({ user: user });
        }
      }
    );
  } catch (error) {
    next(error);
  }
});

app.use("/user", passport.authenticate("jwt", { session: false }), userRouter);
app.use(
  "/comment",
  passport.authenticate("jwt", { session: false }),
  commentRouter
);
app.use("/post", passport.authenticate("jwt", { session: false }), postRouter);

app.use((error, req, res, next) => {
  console.error(error.stack); // Log the error stack trace (for debugging)
  res.status(error.status || 500).json({
    message: error.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
