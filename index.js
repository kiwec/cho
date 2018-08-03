const Discord = require('discord.js');
const client = new Discord.Client();

const dnify = require('./dnify.js');

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);

	let starry_expanse = client.guilds.find('id', '434645974346891267');
	if(!starry_expanse) {
		console.log('Starry Expanse guild not found ! :(');
	}

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
	if(msg.content.indexOf('dnify ') == 0) {
		dnify.replace(msg);
	}
});

client.login(require('./config.json').token);

