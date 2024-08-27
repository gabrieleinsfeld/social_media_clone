const userRouter = require("../routes/userRouter");
const request = require("supertest");
const express = require("express");
const app = express();
const mockUser = {
  id: "c9d82052-d5c1-4bfb-adae-695db408b0d8",
  username: "gabrieleinsfeld@gmail.com",
  email: "gabrieleinsfeld@gmail.com",
  password: "$2a$10$jIqafpvoHQAe1wD8e3YTGuBpBglNmKMUy4Jy2Qjo4SBiEpng3ThYO",
  profilePicture: null,
  bio: null,
  location: null,
  dateJoined: "2024-08-27T21:36:25.629Z",
  lastLogin: null,
  isActive: true,
  isVerified: false,
};

app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  req.user = mockUser; // Simulate an authenticated user
  next();
});

app.use("/", userRouter);
app.use((error, req, res, next) => {
  console.error(error.stack); // Log the error stack trace (for debugging)
  res.status(error.status || 500).json({
    message: error.message || "Internal Server Error",
  });
});

test("get user route works", (done) => {
  request(app)
    .get("/")
    .expect("Content-Type", /json/)
    .expect({
      user: {
        id: "c9d82052-d5c1-4bfb-adae-695db408b0d8",
        username: "gabrieleinsfeld@gmail.com",
        email: "gabrieleinsfeld@gmail.com",
        password:
          "$2a$10$jIqafpvoHQAe1wD8e3YTGuBpBglNmKMUy4Jy2Qjo4SBiEpng3ThYO",
        profilePicture: null,
        bio: null,
        location: null,
        dateJoined: "2024-08-27T21:36:25.629Z",
        lastLogin: null,
        isActive: true,
        isVerified: false,
      },
    })
    .expect(200, done);
});

test("get user by id route works", (done) => {
  request(app)
    .get("/hello")
    .expect({
      message: "Error: User not found",
    })
    .expect(500, done);
});

test("get user by id route works", (done) => {
  request(app)
    .get("/fded8d24-d44f-4f65-b810-0b9744952ac0")
    .expect({
      id: "fded8d24-d44f-4f65-b810-0b9744952ac0",
      username: "gabrielSoares",
      email: "helloWorls@gmail.com",
      password: "myPassword",
      profilePicture: null,
      bio: null,
      location: null,
      dateJoined: "2024-08-27T19:37:13.976Z",
      lastLogin: null,
      isActive: true,
      isVerified: false,
    })
    .expect(200, done);
});

test("post user error works", (done) => {
  request(app)
    .post("/")
    .type("form")
    .send({
      username: "gabrirloares",
      email: "helloWrlr@gmail.com",
      password: "myPassword",
    })
    .expect(500, done);
});

test("post start following works", (done) => {
  request(app)
    .post("/asdasd")
    .type("form")
    .send({
      userId: "fded8d24-d44f-4f65-b810-0b9744952ac0",
    })
    .expect(Object);
});

// test("post user route works", (done) => {
//   request(app)
//     .post("/test")
//     .type("form")
//     .send({
//       username: "gabrielSoares",
//       email: "helloWorls@gmail.com",
//       password: "myPassword",
//     })
//     .then(() => {
//       request(app)
//         .get("/test")
//         .expect(
//           {
//             username: "gabrielSoares",
//             email: "helloWorls@gmail.com",
//             password: "myPassword",
//           },
//           done
//         );
//     });
// });
