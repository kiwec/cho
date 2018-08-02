const Discord = require('discord.js');
const client = new Discord.Client();

const dnify = require('./dnify.js');

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);

	try {
		dnify.init(client);
	} catch(err) {
		console.error(err);
	}
});

client.on('error', err => {
	console.log('Connection error.');
});

client.on('message', msg => {
	if(msg.content.indexOf('dni ') == 0) {
		dnify.replace(msg);
	}
});

client.login(require('./config.json').token);

