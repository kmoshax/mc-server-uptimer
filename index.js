const mineflayer = require("mineflayer");
const cmd = require("mineflayer-cmd").plugin;
const config = require("./config");
const actions = ["forward", "back", "left", "right"];
const pi = Math.PI;

let moving = false;
let connected = false;
let lastAction;

const { ip: host, name: username, autonightskip: nightSkip } = config;

const bot = mineflayer.createBot({
  host: host,
  username: `${username}_kmosha`,
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
