/*

	Index File
	https://github.com/StoreLand-day

*/

const { Client, Intents, MessageEmbed } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
const fetch = require("node-fetch")
require('dotenv').config()

client.once('ready', () => {
	client.user.setStatus('idle')
});

client.on('messageCreate', (message) => {

	if (message.author.bot) return;

    if(message.content === '!verify') {
		if(message.channel.id == process.env.ChannelVerification) {
			message.member.roles.add(process.env.VerifiedRole)
		}
    }

	if(message.channel.id == process.env.ChannelVerification) {
		message.delete()
	}

	if(message.content === '!coupon') {
		message.delete()

		if (!message.member.roles.cache.has(process.env.AdminRole)) return;

		const temp = StringGenerator(20)

		fetch('https://www.gmodstore.com/api/v3/products/' + process.env.GmodStoreProductID + '/coupons', { 

			method: 'POST',

			body: JSON.stringify({
				product: process.env.GmodStoreProductID,
				percent: 10, 
				code: temp,
				maxUses: 1,
				expiresAt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7)
			}),

			headers: new fetch.Headers({
				'Authorization': 'Bearer ' + (process.env.GmodStoreToken),
				'Content-Type': 'application/json'
			}), 

		})

		message.channel.send(temp)
    }
});

function StringGenerator(length) {

    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *  charactersLength));
   }

   return result;
}

client.login(process.env.DiscordToken);