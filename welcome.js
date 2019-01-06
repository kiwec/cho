const welcome_messages = require('./welcome_messages.json');

async function welcome(clients, member, status) {
	const intro = 'Welcome to ***The Starry Expanse Project\'s*** official Discord server!\nPlease make sure to read the rules!';

	// Get random message
	const message = welcome_messages[status][Math.floor(Math.random() * welcome_messages[status].length)];
	const bot = clients[message[0]];
	if(status == 'joined') message[1] += ' ' + intro;

	// Get GuildChannel for selected bot
	const welcome_channel = member.guild.channels.find(ch => ch.name == 'welcome');
	const bot_channel = bot.channels.get(welcome_channel.id);
	if(!bot_channel) {
		console.error(`${member.displayName} joined ${member.guild.name} but there is no #welcome channel :(`);
		console.error(`Is ${bot.user.displayName} invited to ${member.guild.name}?`);
		return;
	}

	try {
		await bot_channel.send(message[1].replace('@name', member));
		console.log(`${bot.user.displayName}: ${member.displayName} ${status} ${member.guild.name}`);
	} catch(err) {
		console.error(`${bot.user.displayName} couldn't welcome ${member.displayName} in ${member.guild.name}. Do they have permissions?`);
	}
}

module.exports = welcome;

