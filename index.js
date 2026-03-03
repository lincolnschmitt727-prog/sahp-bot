const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ],
});

const TOKEN = process.env.TOKEN;
const AUTOROLE_ID = "1478416255433310300";
const COMMAND_ROLE_ID = "1478417577322479657";

const WELCOME_CHANNEL_ID = "1478451925086113863";
const APPLICATION_CHANNEL_ID = "1478405843652448358";

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

//
// 🚔 WELCOMER + AUTOROLE
//
client.on("guildMemberAdd", async (member) => {
  const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor(0x0A1F44)
    .setTitle("SAN ANDREAS HIGHWAY PATROL")
    .setDescription(
      `━━━━━━━━━━━━━━━━━━\n\n` +
      `Welcome ${member},\n\n` +
      `Submit an application in <#${APPLICATION_CHANNEL_ID}>.\n\n` +
      `**Safety • Service • Security**\n\n` +
      `━━━━━━━━━━━━━━━━━━`
    )
    .setTimestamp();

  channel.send({ embeds: [embed] });

  const role = member.guild.roles.cache.get(AUTOROLE_ID);
  if (role) member.roles.add(role).catch(() => {});
});

//
// 🔹 SLASH COMMANDS
//
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  //
  // INFRACTION
  //
  if (interaction.commandName === "infraction") {

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
      return interaction.reply({ content: "❌ No permission.", ephemeral: true });

    const user = interaction.options.getUser("user");
    const type = interaction.options.getString("type");
    const reason = interaction.options.getString("reason");

    let color;
    let typeLabel;

    if (type === "minor") {
      color = 0xFFD700;
      typeLabel = "Minor Violation";
    } else if (type === "major") {
      color = 0xFF8C00;
      typeLabel = "Major Violation";
    } else {
      color = 0x8B0000;
      typeLabel = "Severe Violation";
    }

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle("🚨 INFRACTION ISSUED")
      .addFields(
        { name: "User", value: user.tag, inline: true },
        { name: "Type", value: typeLabel, inline: true },
        { name: "Moderator", value: interaction.user.tag, inline: true },
        { name: "Reason", value: reason }
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }

  //
  // PROMOTION
  //
  if (interaction.commandName === "promotion") {

    if (!interaction.member.roles.cache.has(COMMAND_ROLE_ID))
      return interaction.reply({ content: "❌ Only Command Staff can promote.", ephemeral: true });

    const user = interaction.options.getUser("user");
    const newRole = interaction.options.getRole("new_rank");
    const reason = interaction.options.getString("reason");

    const member = interaction.guild.members.cache.get(user.id);
    if (!member)
      return interaction.reply({ content: "❌ Member not found.", ephemeral: true });

    const confirm = new ButtonBuilder()
      .setCustomId("confirm_promo")
      .setLabel("Confirm Promotion")
      .setStyle(ButtonStyle.Success);

    const cancel = new ButtonBuilder()
      .setCustomId("cancel_promo")
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(confirm, cancel);

    await interaction.reply({
      content: `⚠ Confirm promotion of **${user.tag}** to **${newRole.name}**?`,
      components: [row],
    });

    const filter = i => i.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000,
      max: 1,
    });

    collector.on("collect", async i => {

      if (i.customId === "cancel_promo")
        return i.update({ content: "❌ Promotion cancelled.", components: [] });

      const rankRoleNames = [
        "Cadet",
        "Trooper",
        "Senior Trooper",
        "Sergeant",
        "Lieutenant",
        "Captain",
        "Major"
      ];

      member.roles.cache.forEach(role => {
        if (rankRoleNames.includes(role.name))
          member.roles.remove(role).catch(() => {});
      });

      await member.roles.add(newRole).catch(() => {});

      const embed = new EmbedBuilder()
        .setColor(0xFFD700)
        .setTitle("🎖 PROMOTION ANNOUNCEMENT")
        .setDescription(
          `━━━━━━━━━━━━━━━━━━\n\n` +
          `**Member:** ${user.tag}\n` +
          `**New Rank:** ${newRole}\n` +
          `**Promoted By:** ${interaction.user.tag}\n\n` +
          `**Reason:** ${reason}\n\n` +
          `━━━━━━━━━━━━━━━━━━`
        )
        .setTimestamp();

      await i.update({ content: "", embeds: [embed], components: [] });
    });

    return;
  }

  //
  // BAN
  //
  if (interaction.commandName === "ban") {

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return interaction.reply({ content: "❌ No permission.", ephemeral: true });

    const user = interaction.options.getUser("user");

    await interaction.guild.members.ban(user.id).catch(() => {});
    return interaction.reply(`🔨 ${user.tag} has been banned.`);
  }

  //
  // KICK
  //
  if (interaction.commandName === "kick") {

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers))
      return interaction.reply({ content: "❌ No permission.", ephemeral: true });

    const user = interaction.options.getUser("user");
    const member = interaction.guild.members.cache.get(user.id);

    await member.kick().catch(() => {});
    return interaction.reply(`👢 ${user.tag} has been kicked.`);
  }

  //
  // MUTE
  //
  if (interaction.commandName === "mute") {

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
      return interaction.reply({ content: "❌ No permission.", ephemeral: true });

    const user = interaction.options.getUser("user");
    const time = interaction.options.getInteger("time");
    const unit = interaction.options.getString("unit");

    let duration;
    if (unit === "minutes") duration = time * 60 * 1000;
    if (unit === "hours") duration = time * 60 * 60 * 1000;
    if (unit === "days") duration = time * 24 * 60 * 60 * 1000;

    const member = interaction.guild.members.cache.get(user.id);
    await member.timeout(duration).catch(() => {});

    return interaction.reply(`🔇 ${user.tag} muted for ${time} ${unit}.`);
  }

  //
  // SAY
  //
  if (interaction.commandName === "say") {

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
      return interaction.reply({ content: "❌ No permission.", ephemeral: true });

    const message = interaction.options.getString("message");

    await interaction.reply({ content: "✅ Sent.", ephemeral: true });
    await interaction.channel.send(message);
  }

});

client.login(TOKEN);
