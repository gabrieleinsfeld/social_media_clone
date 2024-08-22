const userRouter = require("../routes/userRouter");
const request = require("supertest");
const express = require("express");
const app = express();
const mockUser = { id: 1, username: "testuser", email: "testuser@example.com" };

app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  req.user = mockUser; // Simulate an authenticated user
  next();
});

app.use("/", userRouter);

test("userRouter route works", (done) => {
  request(app)
    .get("/")
    .expect("Content-Type", /json/)
    .expect({ message: "hello" })
    .expect(200, done);
});

// test("testing route works", done => {
//   request(app)
//     .post("/test")
//     .type("form")
//     .send({ item: "hey" })
//     .then(() => {
//       request(app)
//         .get("/test")
//         .expect({ array: ["hey"] }, done);
//     });
// });
