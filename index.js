require("dotenv").config();
const mineflayer = require("mineflayer");
const cmd = require("mineflayer-cmd").plugin;
const express = require("express");
const path = require("path");
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
const router = express.Router();

const actions = ["forward", "back", "left", "right"];
const pi = Math.PI;

let moving = false;
let connected = false;
let lastAction;

/*
 * SERVER_IP, SERVER_NAME, SERVER_PORT, BOT_USERNAME
 */

const { SERVER_IP, SERVER_NAME, SERVER_PORT, BOT_USERNAME } = process.env;

const bot = mineflayer.createBot({
  host: SERVER_IP,
  port: SERVER_PORT,
  username: `${BOT_USERNAME}_kmosha`,
});

bot.loadPlugin(cmd);

bot.on("login", () => {
  console.log("[BOT] Logged In");
  bot.chat("hello");
});

bot.on("time", () => {
  if (!connected) {
    return;
  }

  if (moving) {
    bot.setControlState(lastAction, false);
    moving = false;
  } else {
    const yaw = Math.random() * pi - 0.5 * pi;
    const pitch = Math.random() * pi - 0.5 * pi;
    bot.look(yaw, pitch, false);
    lastAction = actions[Math.floor(Math.random() * actions.length)];
    bot.setControlState(lastAction, true);
    moving = true;
    bot.activateItem();
  }
});

bot.on("spawn", () => {
  console.log(`[BOT] Spawned`);
  connected = true;
});

bot.on("death", () => {
  bot.emit("respawn");
  console.log(`[BOT] respowning`);
});

bot.on("error", (err) => {
  console.log(`[ERROR]: ` + err.message);
});

router.get("/", (request, response) => {
  response.render("index", { SERVER_NAME, SERVER_IP, SERVER_PORT });
});

app.use("/", router);

app.listen(3000, function () {
  console.log("Listening on port " + 3000);
});