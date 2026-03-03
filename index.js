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
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
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
// COMMAND HANDLER
// ============================
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "say") {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply({ content: "❌ No permission.", ephemeral: true });
    }

    const msg = interaction.options.getString("message");

    await interaction.reply({ content: "✅ Sent.", ephemeral: true });
    await interaction.channel.send(msg);
  }
});

console.log("About to login...");

const loginTimeout = setTimeout(() => {
  console.error("LOGIN TIMEOUT: Discord never responded. This is almost always an invalid token (or rarely a blocked connection).");
  process.exit(1);
}, 15000);

client.login(TOKEN)
  .then(() => {
    clearTimeout(loginTimeout);
    console.log("LOGIN ATTEMPT SUCCESSFUL");
  })
  .catch((err) => {
    clearTimeout(loginTimeout);
    console.error("LOGIN FAILED:", err);
    process.exit(1);
  });

