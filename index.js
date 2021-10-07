const dotenv = require('dotenv');
const { Widget, Client, Intents, MessageCollector } = require('discord.js');

dotenv.config();

const intents = new Intents([Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES]);
const client = new Client({ intents });


client.on('ready', () => {
	console.log(`Logged in as ${client.user.username}!`);
})

client.on('messageCreate', async (message) => {
	if (message.content === '/emoji_usage') {
		emojiTally = {};
		parsedChannels = 0;

		channels = await message.guild.channels.fetch();
		textChannels = channels.filter(channel => channel.type === 'GUILD_TEXT');
		textChannels.forEach(async (channel) => {
			messages = await channel.messages.fetch();
			messages.forEach(async (message) => {
				reactions = message.reactions.cache
				reactions.forEach(reaction => {
					emojiName = (reaction.emoji.id != null) ? `<:${reaction.emoji.name}:${reaction.emoji.id}>` : reaction.emoji.name;
					if (emojiTally[emojiName]) {
						emojiTally[emojiName]++;
					} else {
						emojiTally[emojiName] = 1;
					}
				});
			});
			if(++parsedChannels === textChannels.size){
				response = "";

				sortedTally = Object.fromEntries(
					Object.entries(emojiTally).sort(([,a],[,b]) => b - a)
				);

				for(const emoji in sortedTally){
					response += `${emoji}    **${sortedTally[emoji]}**\n\n`
				}
				
				message.reply(response);
			}
		});
	}
})

client.login(process.env.TOKEN);
