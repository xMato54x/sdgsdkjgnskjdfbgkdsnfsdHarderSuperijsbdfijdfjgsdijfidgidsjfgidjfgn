const Discord = require("discord.js");
const bot = new Discord.Client;
const config = require("./config.json");

bot.on("ready", () => {
    console.log("Bot je aktiviran!");
    bot.generateInvite(["ADMINISTRATOR"]).then((invite) => {
        console.log("Invite link bota je: " + invite);
    })
})

bot.on("message", (message) => {
    if(message.author.bot || !message.content.startsWith(config.prefix)) return;

    var args = message.content.substring(config.prefix.length).split(" ");

    switch(args[0].toLowerCase()) {
        case "help":
            var helpEmbed = new Discord.RichEmbed()
                .setColor("RANDOM")
                .addField("Member Komande", "$help - prikazuje pomoc servera\n$serverinfo - prikazuje informacije servera\n$botinfo - prikazuje informacije bota\n$say - da bot nesto napise u chat\n")
                .addField("Admin Komande", "$ban - za bananje igraca\n$kick - za kickanje igraca")
            message.channel.send(helpEmbed);
            break;
        
        case "serverinfo":
            var srvInfoEmbed = new Discord.RichEmbed()
                .setColor("RANDOM")
                .setThumbnail(message.author.avatarURL)
                .setDescription(":star: Informacije Servera :star:")
                .addField("Ime servera",  message.guild.name)
                .addField("Vlasnik servera", message.guild.owner)
                .addField("Broj igraca s botovima", message.guild.memberCount + "")
                .addField("Regija servera", message.guild.region)
                .addField("Napravljen", message.guild.createdAt)
                .addField("Slika servera", message.guild.iconURL)
                .setFooter("SOON MORE.");
            message.channel.sendEmbed(srvInfoEmbed);
            break;
        
        case "botinfo":
            const aboutEmbed = new Discord.RichEmbed()
                .setDescription(`:comet: Informacije o botu :comet:`)
                .addField("Ime bota", "HarderBOT#9229")
                .addField("Help komanda", "$help")
                .addField("Napravljen u", `Javascript (discord.js)`)
                .addField("Napravio", "xMato54x (https://discord.gg/ykvYS8b)")
                .setColor("RANDOM")
                .setThumbnail(message.author.avatarURL)
                .setFooter("Informacije o botu", message.author.avatarURL)
                .setTimestamp();
            message.channel.sendEmbed(aboutEmbed);
            break;
			
        case "serverinvite":
            var serverinviteEmbed = new Discord.RichEmbed()
                .setColor("RANDOM")
                .addField("------------------------")
            message.channel.send(serverinviteEmbed);
            break;			
			

        // Admin komande, od sad pa nadalje

        case "ban":
            if(message.member.hasPermission("BAN_MEMBERS")) {
                let banUser = message.mentions.members.first();
                let banReason = args.slice(2).join(" ");
                let serverOwner = message.guild.owner;
    
                if(!banUser) {
                    var banUserNotFound = new Discord.RichEmbed()
                        .setColor(0xff0000)
                        .setDescription(":x: | Ne mogu naci tog korisnika");
                    message.channel.sendEmbed(banUserNotFound);
                    return;
                }
    
                if(!banUser.bannable) {
                    var biggerRoleBanError = new Discord.RichEmbed()
                        .setColor(0xff0000)
                        .setDescription(":x: | Ne mozes banovati ovog korisnika");
                    message.channel.sendEmbed(biggerRoleBanError);
                    return;
                }
    
                if(!banReason) {
                    banReason = "Nema razloga";
                }
    
                var banUserEmbed = new Discord.RichEmbed()
                    .setColor(0xff0000)
                    .setDescription(":x: Informacije bana :x:")
                    .addField("Banovani korisnik", `${banUser}`)
                    .addField("Banovan od strane", message.author)
                    .addField("Razlog", banReason)
                message.channel.sendEmbed(banUserEmbed);
                banUser.ban();
                setTimeout(function(){
                    message.delete();
                }, 500);
            } else {
                var noBanPerm = new Discord.RichEmbed()
                    .setColor(0xff0000)
                    .setDescription(":x: | Treba ti BAN_MEMBERS permisija");
                message.channel.sendEmbed(noBanPerm);
            }
            break;

        case "kick":
            if(message.member.hasPermission("KICK_MEMBERS")) {
                let kickUser = message.mentions.members.first();
                let kickReason = args.slice(2).join(" ");
                let serverOwner = message.guild.owner;
    
                if(!kickUser) {
                    var kickUserNotFound = new Discord.RichEmbed()
                        .setColor(0xff0000)
                        .setDescription(":x: | Ne mogu naci tog korisnika");
                    message.channel.sendEmbed(kickUserNotFound);
                    return;
                }
    
                if(!kickUser.kickable) {
                    var biggerRoleKickError = new Discord.RichEmbed()
                        .setColor(0xff0000)
                        .setDescription(":x: | Ne mozes kickovati tog korisnika");
                    message.channel.sendEmbed(biggerRoleKickError);
                    return;
                }
    
                if(!kickReason) {
                    kickReason = "Nema razloga";
                }
    
                var kickUserEmbed = new Discord.RichEmbed()
                    .setColor(0x4C924C)
                    .setDescription(":link: Informacije kicka :link:")
                    .addField("Kickovani korisnik", `${kickUser}`)
                    .addField("Kickovan od strane", message.author)
                    .addField("Razlog", kickReason)
                message.channel.sendEmbed(kickUserEmbed);
                kickUser.kick();
                setTimeout(function(){
                    message.delete();
                }, 500);
            } else {
                var noKickPerm = new Discord.RichEmbed()
                .setColor(0xff0000)
                .setDescription(":x: | Treba ti KICK_MEMBERS permisija.");
                message.channel.sendEmbed(noKickPerm);
            }
            break;

            case "say":
            if(message.member.hasPermission("SPEAK")) {
                let sayStringToType = args.join(" ").slice(3);
        
                if(!sayStringToType) {
                var noSayStringToType = new Discord.RichEmbed()
                    .setColor(0xff0000)
                    .setDescription(":x: | Moras staviti sta hoces da bot kaze");
                message.channel.sendEmbed(noSayStringToType);
                return;
                }
        
                if(message.content.includes("@everyone") || message.content.includes("@here")) {
                var everyoneAndHereDisabledOnSayCommand = new Discord.RichEmbed()
                    .setColor(0xff0000)
                    .setDescription(":x: | Zabranjeno je tagovati everyone ili here");
                message.channel.sendEmbed(everyoneAndHereDisabledOnSayCommand);
                return;
                }
        
                message.channel.sendMessage(sayStringToType);
                setTimeout(function(){
                    message.delete();
                }, 500);
            } else {
                var noSayPerm = new Discord.RichEmbed()
                    .setColor(0xff0000)
                    .setDescription(":x: | Nemaš premisiju za komandu");
                message.channel.sendEmbed(noSayPerm);
            }
            break;
    }
})

bot.login(config.token);