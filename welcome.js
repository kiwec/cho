const welcome_messages = require('./welcome_messages.json');

async function welcome(clients, member, status) {
	// Get random message
	const message = welcome_messages[status][Math.floor(Math.random() * welcome_messages[status].length)];
	const bot = clients[message[0]];

	// Get GuildChannel for selected bot
	const welcome_channel = member.guild.channels.find(ch => ch.name == 'welcome');
	const bot_channel = bot.channels.get(welcome_channel.id);
	if(!bot_channel) {
		console.error(`${member.displayName} joined ${member.guild.name} but there is no #welcome channel :(`);
		console.error(`Is ${bot.user.tag} invited to ${member.guild.name}?`);
		return;
	}

	try {
		let msg = message[1].replace('@name', member);
		if(status == 'joined') {
			msg += ' Welcome to ***The Starry Expanse Project\'s*** official Discord server!\nPlease make sure to read the rules!';
		}

		await bot_channel.send(msg);
		console.log(`${bot.user.tag}: ${member.displayName} ${status} ${member.guild.name}`);
	} catch(err) {
		console.error(`${bot.user.tag} couldn't welcome ${member.displayName} in ${member.guild.name}. Do they have permissions?`);
	}
}

module.exports = welcome;

