var Discord = require("discord.js"),
client = new Discord.Client(),
Enmap = require("enmap"),
db = new Enmap({name: "gaber"}),
prefix = "$"
/*
@Gaber Elsayed
*/
const devs = ["510970297814614016"]
client.on("message", message => {
db.ensure(`rec${message.guild.id}`,{channel: "",emoji: "",roles: "",messageid: ""})
if(message.author.bot) return undefined;
let args = message.content.split(' ');
if(args[0].toLowerCase() == prefix + `reaction`) {
if(!message.guild.member(client.user).hasPermission("ADMINISTRATOR")) return message.channel.send(`**❌ | I do not have permission.**`);
if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR")) return message.channel.send(`**❌ | You do not have permission.**`);
message.reply("**✅ | Mention the room**").then(messages => {
const filter = response => response.author.id === message.author.id;
message.channel.awaitMessages(filter, { maxMatches: 1, time: 30000, errors: ['time'] }).then( collected => {
message.delete();
let idC = message.guild.channels.find(c=>c.id == collected.first().mentions.channels.first().id)
if(!idC) return messages.edit("**❌ | I can\'t find this room**");
idC = idC.id;
db.set(`rec${message.guild.id}`, idC ,"channel")
messages.edit(`**✅ | Enter the emoji.**`)
const filter = response => response.author.id === message.author.id;
message.channel.awaitMessages(filter, { maxMatches: 1, time: 30000, errors: ['time'] }).then( collected => {
if(!require("node-emoji").hasEmoji(collected.first().content)) return messages.edit("**❌ | I can\'t find this emoji**");
newemoji = collected.first().content;
db.set(`rec${message.guild.id}`, newemoji,"emoji")
message.delete();
messages.edit(`**✅ | Mention the role!**`)
const filter = response => response.author.id === message.author.id;
message.channel.awaitMessages(filter, { maxMatches: 1, time: 30000, errors: ['time'] })
.then( collected => {
let roleW = collected.first().mentions.roles.first()
let role = message.guild.roles.find(`name`, roleW.name);
if(!role) return message.reply(`**❌ | I can't find this role!**`);
roleW = role.id;
db.set(`rec${message.guild.id}`, roleW,"roles")
messages.edit(`**✅ | Put message ID**`)
const filter = response => response.author.id === message.author.id;
message.channel.awaitMessages(filter, { maxMatches: 1, time: 30000, errors: ['time'] }).then( collected =>{
stringNew = collected.first().content;
db.set(`rec${message.guild.id}`, stringNew,"messageid")
let c = client.guilds.get(message.guild.id).channels.get(db.get(`rec${message.guild.id}`, "channel"))
c.fetchMessage(db.get(`rec${message.guild.id}`, "messageid")).then(messageA => {
messageA.react(db.get(`rec${message.guild.id}`, "emoji"))
}).catch(e => {console.log(e.message)});
}).catch(e => {console.log(e.message)});  
}).catch(e => {console.log(e.message)});
}).catch(e => {console.log(e.message)});
}).catch(e => {console.log(e.message)});
}).catch(e => {console.log(e.message)});
}
});


client.on('raw', packet => {
if(!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
if (packet.t == 'MESSAGE_REACTION_ADD') {
if(packet.d.message_id == db.get(packet.d.guild_id, "message")) { // ايدي المسج
let emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
if(emoji == db.get(packet.d.guild_id, "emoji")){ // الايموجي الي بيضغط عليه عشان يسوي تكت
let u = client.users.get(packet.d.user_id);
let channel = client.channels.get(db.get(packet.d.guild_id, "channel"));
if(channel.type == "dm"||!channel.guild) return; // ._.
channel.fetchMessage(db.get(packet.d.guild_id, "messageid")).then(messageA => {
messageA.react(db.get(packet.d.guild_id, "emoji"));
var filter = (reaction) => {return reaction.emoji.name == db.get(packet.d.guild_id, "emoji")};
const Acc = messageA.createReactionCollector(filter, {time: 120000});
Acc.on("collect", r=>{
let member = messageA.guild.members.get(r.users.last().id);
if(!member) return;
if(member.roles.find(r => r.id == db.get(packet.d.guild_id, "roles"))) return;
member.addRole(db.get(packet.d.guild_id, "roles"));
})
}) 
}
}
}
});

client.on("message", async message => {

    if (!message.guild || message.author.bot) return;
    let args = message.content.split(" ");
       if(devs.includes(message.author.id)) {
    if (args[0] == `${prefix}setname`) {
       message.delete();
      if (!args[1]) return message.reply("Type the new username!").then(message => {
              message.delete(20000);
  });
      try {
        await client.user.setUsername(args.slice(1).join(" "));
        await message.reply("Done").then(message => {
              message.delete(20000);
  });
      } catch (e) {
        await message.reply(`Error! ${e.message || e}`);
      }
    }
  }
    });
  client.on("message", async message => {
  
    if (!message.guild || message.author.bot) return;
    let args = message.content.split(" ");
    if(devs.includes(message.author.id)) {
   if (args[0] == `${prefix}setavatar`) {
       message.delete();
      if (!args[1]) return message.reply("Type the avatar URL!").then(message => {
              message.delete(20000);
  });
      try {
        await client.user.setAvatar(args[1]);
        await message.reply("Done").then(message => {
              message.delete(20000);
  }); 
             message.delete();
  
      } catch (e) {
        message.reply(`Error! ${e.message || e}`);
      }
    }
       }
  });

client.login("token");
