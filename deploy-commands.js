const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const TOKEN = process.env.TOKEN;
const CLIENT_ID = "1478441614031585301";
const GUILD_ID = "1478403345466003536";


const commands = [

  // INFRACTION
  new SlashCommandBuilder()
    .setName("infraction")
    .setDescription("Issue an infraction")
    .addUserOption(option =>
      option.setName("user").setDescription("User").setRequired(true))
    .addStringOption(option =>
      option.setName("type")
        .setDescription("Infraction Type")
        .setRequired(true)
        .addChoices(
          { name: "Minor Violation", value: "minor" },
          { name: "Major Violation", value: "major" },
          { name: "Severe Violation", value: "severe" }
        ))
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason").setRequired(true)),

  // PROMOTION
  new SlashCommandBuilder()
    .setName("promotion")
    .setDescription("Promote a member")
    .addUserOption(option =>
      option.setName("user").setDescription("Member").setRequired(true))
    .addRoleOption(option =>
      option.setName("new_rank").setDescription("New Rank").setRequired(true))
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason").setRequired(true)),

  // BAN
  new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member")
    .addUserOption(option =>
      option.setName("user").setDescription("User").setRequired(true)),

  // KICK
  new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member")
    .addUserOption(option =>
      option.setName("user").setDescription("User").setRequired(true)),

  // MUTE
  new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a member")
    .addUserOption(option =>
      option.setName("user").setDescription("User").setRequired(true))
    .addIntegerOption(option =>
      option.setName("time").setDescription("Time amount").setRequired(true))
    .addStringOption(option =>
      option.setName("unit")
        .setDescription("Time unit")
        .setRequired(true)
        .addChoices(
          { name: "Minutes", value: "minutes" },
          { name: "Hours", value: "hours" },
          { name: "Days", value: "days" }
        )),

  // SAY
  new SlashCommandBuilder()
    .setName("say")
    .setDescription("Make the bot say something")
    .addStringOption(option =>
      option.setName("message").setDescription("Message").setRequired(true))

].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log("Slash commands deployed.");
  } catch (error) {
    console.error(error);
  }
})();