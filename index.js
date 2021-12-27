const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const axios = require("axios");
const parser = require("xml-js");

const app = express();
app.use(express.json());
app.use(cors());
const pino = require("express-pino-logger")();
app.use(pino);
const client = require("twilio")(process.env.sid, process.env.token);

app.post("/api/messages", (req, res) => {
  res.header("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  client.messages
    .create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: req.body.to,
      body: req.body.body,
    })
    .then(() => {
      res.send(JSON.stringify({ success: true }));
    })
    .catch((err) => {
      console.log("err", err);
      //res.send(JSON.stringify({ success: false }));
    });
});
app.get("/blogs", (req, res) => {
  axios
    .get("https://medium.com/feed/@magesstudio")
    .then((response) => parser.xml2json(response.data, { compact: true }))
    .then((data) => {
      res.send(data);
    });
});

app.listen(process.env.PORT || 4000, () => {
  console.log("server mages");
});
