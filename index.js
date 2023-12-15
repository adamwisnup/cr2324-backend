const express = require("express");
const app = express();
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const participantController = require("./src/participant/participant.controller");

app.use("/participant", participantController);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
