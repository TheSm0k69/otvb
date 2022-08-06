const express = require('express');
const app = express();
const { Client, Intents, Collection, Interaction  } = require('discord.js')
const discord = require("discord.js")
const fs = require('fs')
const config = require("./config.json")
const client = new Client({
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
    intents: 32767,
});

module.exports = client;

client.on("ready", () => {
  console.log(`RxBer Scripts`.green)
  console.log(`Logged in as ${client.user.tag}`.cyan)
  client.user.setActivity("Veendam", {
    type: "WATCHING",
  });
});

//new collections
client.commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.slashCommands = new Collection();
client.categories = fs.readdirSync('./commands');

//load the files
['command', 'slashCommand'].forEach((handler) => {
    require(`./handler/${handler}`)(client)
});


app.listen(8081, () => {
  console.log('Listening on port 8081')
});

app.get('/', (req, res) => {
  res.send(`<h2>Discord.js v13 Quick.db Ticket bot is alive!<h2>`)
});

client.on("guildMemberAdd", member => {

  var role = member.guild.roles.cache.get(config.role);

  if (!role) return;

  member.roles.add(role);

  let { MessageEmbed } = require("discord.js")
  console.log(`${member.user.tag} is ${member.guild.name} gejoined!`);
  var botEmbed = new discord.MessageEmbed()
      .setColor(config.embed_color)
      .setTitle("👋 Welkom in Veendam Roleplay!")
      .setDescription(`Hey <@${member.id}>, Welkom op **${member.guild.name}** Lees A.U.B. eerst even de regels door. En klik dan op de emoji om toegang te krijgen tot de community!`)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 4096 }))
      .setImage("https://cdn-longterm.mee6.xyz/plugins/welcome/images/795919530773315604/c74eb25539d1815d1b10ad658124daf2499ae02e618bcc8b71c22b968c94be52.gif")
      .addFields(
          { name: "__Aantal inwoners__:", value: `> Veendam heeft momenteel: **${member.guild.memberCount.toString()}** inwoners!` }
      )


  member.guild.channels.cache.get(config.welcome_channel).send({
      content: `<@${member.id}>`,
      embeds: [botEmbed],
  })

});


client.login(config.bot_token)