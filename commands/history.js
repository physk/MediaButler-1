const getSettings = require('../util/getPlexPySettings');
const createHistoryItemModal = require('../util/createHistoryItemModal');
const getHistory = require('../util/getHistoryPlexPy');
const request = require('request');
const Discord = require('discord.js');
exports.run = (bot, msg, params = []) => {

  msg.channel.send("Starting...")
  .then((m) => {
    msg.channel.startTyping();
    if (!params[0]) reject("No username specified");
    let results = null;
    let userQuery = params[0];
    if (params[1]) results = params[1];
    m.edit("Querying PlexPy for information");
    getHistory(msg.guild.id, userQuery, results)
    .then((history) => {
      const embed = new Discord.RichEmbed()
      .setAuthor(`Stats for ${params[0]}`).setColor(11360941).setTimestamp()
      .setFooter(`Called by ${msg.author.username}`, msg.author.avatarURL)
      .addField("Total Duration", history.data.total_duration, true)
      .addField("Shown Duration", history.data.filter_duration, true);
      m.edit({embed});
      if (history.data.data.length === 0) throw "No results found";
      history.data.data.forEach(f => {
        msg.channel.send({embed: createHistoryItemModal(f)});
      });
      msg.channel.stopTyping();
    }).catch((e) => { m.edit(`ERR: ${e}`); msg.channel.stopTyping(); });
  });
};
exports.conf = {
  enabled: true, 
  guildOnly: false, 
  aliases: [],
  permLevel: 0 
};
exports.help = {
  name: "history",
  description: "Pulls the <user>'s last [limit] history items",
  usage: "history <user> [limit]"
};