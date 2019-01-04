const welcome_messages = require('./welcome_messages.json');

async function welcome(clients, member, status) {
	const intro = 'Welcome to ***The Starry Expanse Project\'s*** official Discord server!\nPlease make sure to read the rules!'
	
	// Get random message
	const message = welcome_messages[status][Math.floor(Math.random() * welcome_messages[status].length)];
	const bot = clients[message[0]];

	try {
		// Get GuildChannel for selected bot
		const welcome_channel = member.guild.channels.find(ch => ch.name == 'welcome');
		const bot_channel = bot.channels.get(welcome_channel.id);

		if(status == 'joined') {
			message[1] += ' ' + intro;
		}
		await bot_channel.send(message[1].replace('@name', member));
	} catch(err) {
		console.error(`${bot.user.displayName} could not send welcome message in ${member.guild.name}'s #${bot_channel} channel. Do we have permissions?`);
	}
}

module.exports = welcome;
