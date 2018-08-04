const Discord = require('discord.js');
const client = new Discord.Client();

const PythonShell = require('python-shell');

const dnify = require('./dnify.js');

function python(script, args, cb) {
	PythonShell.run(script, {
		mode: 'text',
		pythonPath: '/usr/bin/python2',
		pythonOptions: ['-u'],
		scriptPath: 'DniTools',
		args: args
	}, cb);
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);

	let starry_expanse = client.guilds.find('id', '434645974346891267');
	if(!starry_expanse) {
		console.log('Starry Expanse guild not found ! :(');
	}
});

client.on('error', err => {
	console.log('Connection error.');
});

client.on('message', msg => {
	if(msg.content.indexOf('!dni') == 0) {
		let args = msg.content.split(' ');

		if(args.length == 1) {
			msg.channel.send({
				embed: {
					fields: [
						{
							name: '!dni text',
							value: 'Converts text to D\'ni characters using OTS format.'
						},
						{
							name: '!dni ots text',
							value: 'Converts text to D\'ni characters using OTS format.'
						},
						{
							name: '!dni nts text',
							value: 'Converts text to D\'ni characters using NTS format.'
						},
						{
							name: '!dni time',
							value: 'Shows current D\ni time.'
						}
					]
				}
			});
		} else {
			args.shift(1);
			if(args[0].toLowerCase() == 'nts') {
				args.shift(1);
				let text = dnify.NTStoDnifont(args.join(' '));
				dnify.replaceMsg(msg, text);
			} else if(args[0].toLowerCase() == 'time') {
				python('dnitime.py', null, (err, res) => {
					if(err) {
						msg.channel.send('Sorry, something unexpected happened.');
						console.error(err);
						return;
					}

					msg.channel.send(res);
				});
			} else {
				if(args[0].toLowerCase() == 'ots') {
					args.shift(1);
				}

				let text = dnify.OTStoDnifont(args.join(' '));
				dnify.replaceMsg(msg, text);
			}
		}
	}
});

client.login(require('./config.json').token);

