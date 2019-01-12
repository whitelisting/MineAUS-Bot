const config = require("./config/config.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });

});


bot.on("ready", async () => {
  console.log(``)
  console.log(`${bot.user.username} has successfully loaded on ${bot.guilds.size} servers!`);
  bot.user.setPresence({ game: { name: 'on mineaus.net', type: 'PLAYING' }, status: 'online' });
});

bot.on('guildMemberAdd', (member) => {
  const wave = bot.emojis.find(emoji => emoji.name === "blobwave");
  const logChannel = member.guild.channels.find(channel => channel.name === 'join-leave');
  if (!logChannel) return undefined;
  let joinEmbed = new Discord.RichEmbed()
  .setTitle("**» MineAUS Discord «**")
  .setTimestamp()
  .setDescription(`<@${member.user.id}>` + " has joined the **MineAUS Discord** " + wave)
  .setFooter(`mineaus.net`)
  .setColor('#FF4E00')
  logChannel.send(joinEmbed);

  var role = member.guild.roles.find('name', 'Member');

  member.addRole(role)
});

bot.on('guildMemberRemove', (member) => {
  const sad = bot.emojis.find(emoji => emoji.name === "blobsad");
  const logChannel = member.guild.channels.find(channel => channel.name === 'join-leave');
  if (!logChannel) return undefined;
  let leaveEmbed = new Discord.RichEmbed()
  .setTitle("**» MineAUS Discord «**")
  .setTimestamp()
  .setDescription(`<@${member.user.id}>` + " has left the **MineAUS Discord** " + sad)
  .setFooter(`mineaus.net`)
  .setColor('#FF4E00')
  logChannel.send(leaveEmbed);
});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = config.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);

});

bot.login(process.env.BOT_TOKEN)
