const { 
  Client, 
  GatewayIntentBits, 
  PermissionsBitField 
} = require("discord.js");

const express = require("express");

// ============================
// EXPRESS (RENDER PORT FIX)
// ============================
const app = express();

app.get("/", (req, res) => {
  res.send("SAHP Bot is running.");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Web server running.");
});

// ============================
// DISCORD CLIENT
// ============================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ]
});

const TOKEN = process.env.TOKEN;

console.log("Token loaded:", TOKEN ? "YES" : "NO");

// ============================
// READY EVENT
// ============================
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// ============================
// BASIC /say COMMAND EXAMPLE
// ============================
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // commands...
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(TOKEN)
  .then(() => console.log("LOGIN ATTEMPT SUCCESSFUL"))
  .catch((err) => console.error("LOGIN FAILED:", err));
