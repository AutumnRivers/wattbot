const wp = require("wattpad-api");
const Discord = require("discord.js");
const wattbot = new Discord.Client();
const config = require("./config.json");
const wpKey = config.wattpadToken;

wattbot.login(config.discordToken);
const prefix = "wb;"

wattbot.on("ready", () => {
    console.log(`Prepared to go in ${wattbot.guilds.size} servers.`);
    wattbot.user.setActivity("Wattpad, waiting for new stories.", {
        type: "WATCHING"
    });
});

wattbot.on("message", message => {
    if(message.channel.type == "dm") return;
    if(message.author.bot == true) return;

const args = message.content.split(" ").slice(1).join(" ")

    if(message.content.toLowerCase().startsWith(prefix + "story")) {
        console.log("Command ran")
        message.channel.send("Fetching story...").then(message => {
        var title
        var author
        var description
        var cover
        var authorImg
        wp.storyTitle(wpKey, args, 0).then(Stitle => {
            var title = Stitle
        wp.storyAuthor(wpKey, args, 0).then(Sauthor => {
            var author = Sauthor
        wp.storyCover(wpKey, args, 0).then(Scover => {
            var cover = Scover
        wp.storyDesc(wpKey, args, 0).then(desc => {
            var description = desc
        wp.storyAuthorAvatar(wpKey, args, 0).then(avatar => {
            var authorImg = avatar
            message.edit("", {embed: {
                color: 0xff9400,
                title: title,
                description: description,
                image: {
                    url: cover
                },
                footer: {
                    icon_url: authorImg,
                    text: author
                }
            }})
        })
        })
    })})})})
}

})