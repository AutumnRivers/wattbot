const wp = require("wattpad-api");
const Discord = require("discord.js");
const wattbot = new Discord.Client();
const config = require("./config.json");
const wpKey = config.wattpadToken;
const snekfetch = require("snekfetch");

wattbot.login(config.discordToken);
const prefix = "wb;"

wattbot.on("ready", () => {
    console.log(`Prepared to go in ${wattbot.guilds.size} servers.`);
    wattbot.user.setActivity("Wattpad, waiting for new stories.", {
        type: "WATCHING"
    });
});

var title
var author
var description
var cover
var authorImg
var readcount
var votes
var mature

wattbot.on("message", message => {
    if(message.channel.type == "dm") return;
    if(message.author.bot == true) return;
    if(message.channel.nsfw == true) {
        var mature = 1
    } else {
        var mature = 0
    }

const args = message.content.split(" ").slice(1).join(" ")

    if(message.content.toLowerCase().startsWith(prefix + "story")) {
        console.log("Command ran")
        message.channel.send("Fetching story...").then(message => {
            wp.storiesData(wpKey, args, 0, 1, mature).then(stories => {
                if(stories[0] == undefined) return message.edit("No story by that title was found. Maybe retry?")
            })
        wp.storyTitle(wpKey, args, 0, mature).then(Stitle => {
            var title = Stitle
        wp.storyAuthor(wpKey, args, 0, mature).then(Sauthor => {
            var author = Sauthor
        wp.storyCover(wpKey, args, 0, mature).then(Scover => {
            var cover = Scover
        wp.storyDesc(wpKey, args, 0, mature).then(desc => {
            var description = desc
        wp.storyAuthorAvatar(wpKey, args, 0, mature).then(avatar => {
            var authorImg = avatar
        wp.storyReadCount(wpKey, args, 0, mature).then(rcount => {
            var readcount = rcount
        wp.storyVoteCount(wpKey, args, 0, mature).then(vcount => {
            var votes = vcount
        wp.storiesData(wpKey, args, 0, 5, mature).then(story => {
            var storylink = story[0].url
            message.edit("", {embed: {
                color: 0xff9400,
                title: title,
                description: `${description}\n[URL to story](${storylink})`,
                image: {
                    url: cover
                },
                footer: {
                    icon_url: authorImg,
                    text: `${author} | ${readcount} Reads | ${votes} Votes`
                }
            }})
        })
        })
    })})})})})})
})
}

    if(message.content.toLowerCase().startsWith(prefix + "list")) {
        var listid
        var Scount
        message.channel.send("Fetching list...").then(message => {
        wp.userList(wpKey, args).then(list => {
            if(list == undefined) return message.edit("No such user was found, or the user you searched for does not have a story list.")
            var listid = list.id
        wp.listName(wpKey, listid).then(name => {
            var title = name
        wp.listStoryCount(wpKey, listid).then(count => {
            var Scount = count
            message.edit("", {embed: {
                color: 0xff9400,
                title: title,
                description: `${Scount} stories\n[URL to list](https:\/\/www.wattpad.com/list/${listid})`
            }})
        })
        })
        }).catch(error => {
            message.channel.send("Error while looking for the user!\n```\n" + error + "\n```")
        })
    })
    }

    if(message.content.toLowerCase().startsWith(prefix + "help")) {
        message.channel.send("", {embed:
        {color: 0xff9400,
        title: "Wattbot - Search for Wattpad stories in Discord!",
        description: "`story` - Search for a story. Simple enough.\n`list` - Search for a list by the list owner's username.\n`info` - Get some info about Wattbot.\n`status` - See if Wattpad is down."
        }})
    }

    if(message.content.toLowerCase().startsWith(prefix + "status")) {
        snekfetch.get("https://www.wattpad.com/").then(request => {
            if(request.status == 200) {
                message.channel.send("Wattpad is up!\n`Status Text`\n" + request.statusText)
            } else {
                message.channel.send("I'm having trouble connecting to Wattpad...\n`Full error`\nStatus Code: " + request.status + "\nStatus Text: " + request.statusText)
            }
        })
    }

    if(message.content.toLowerCase().startsWith(prefix + "info")) {
        message.channel.send("**Thank you for using Wattbot! :heart:**\nI'm a Discord bot made by `SmartiePlays#5434`. My sole purpose is to find stories and lists on Wattpad using the wattpad-api npm module. Here are some facts about me.\n`Embed Links` is a basic required permission. Promise I won't embed anything bad!\nI was made in node 8, using the discord.js library.\nIf you're not in an NSFW channel, the mature filter is then turned ON, meaning stories marked as mature will *not* show up!")
    }

})