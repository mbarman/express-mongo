const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log("UNHANDLED EXCEPTION Shutting down!!");
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const DB_URL = process.env.DATABASE_URL.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log("Connected");
  });

// creating a document out of model
// so this document var will have some method to interact with db
// const newTour = new Tour({
//   name: 'Mountain Climbing',
//   rating: 5,
//   price: 199.99
// });

// newTour.save().then((doc) => {
//   console.log('New tour saved:', doc)
// });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// generic event handler for all kind of promise rejection
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION Shutting down!!");
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});

console.log(x);
