const Discord = require('discord.js');
const client = new Discord.Client();

const PythonShell = require('python-shell');

const dnify = require('./dnify.js');
const welcome = require('./welcome.js');

function print_help(msg) {
	msg.channel.send({
		embed: {
			fields: [
				{
					name: '!dni [ots|nts|dnifont|dniscript] text',
					value: 'Print text in D\'ni characters using the given format (OTS by default).'
				},
				{
					name: '!dni time',
					value: 'Shows current D\'ni time.'
				},
				{
					name: '!dni translate [ots|nts] text',
					value: 'Translates D\'ni text to english using OTS (default) or NTS format.'
				}
			]
		}
	});
}

function python(script, args, cb) {
	PythonShell.run(script, {
		mode: 'text',
		pythonPath: script == 'dnitime.py' ? '/usr/bin/python2' : '/usr/bin/python3',
		pythonOptions: ['-u'],
		scriptPath: 'DniTools',
		args: args
	}, cb);
}

function getArgType(args) {
	switch(args[0]) {
		case 'dnifont':
		case 'dniscript':
		case 'nts':
		case 'ots':
			args.shift(1);
			return args[0];
		case 'time':
			return 'time';
		case 'translate':
			args.shift(1);
			return 'translate';
		default:
			return 'ots';
	}
}

function translate(msg, args) {
	if(args.length == 1) {
		print_help(msg);
		return;
	}

	var ots = getArgType(args) == 'ots';
	var text = args.join(' ');
	args = ots ? [text] : ['-n', text];

	console.log(`Translated "${text}" (${ots ? 'OTS' : 'NTS'}) for ${msg.author.username}`);
	python('dnitransl.py', args, (err, res) => {
		if(err) throw err;
		msg.channel.send(res);
	});
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);
});

client.on('error', err => {
	console.log('Connection error.');
});

client.on('guildMemberAdd', member => {
	welcome(client, member);
});

client.on('guildMemberRemove', member => {
	welcome(client, member, false);
});

client.on('message', msg => {
	try {
		if(msg.content.indexOf('!dni') == 0) {
			let args = msg.content.split(' ');

			if(args.length == 1) {
				print_help(msg);
			} else {
				// Remove "!dni " from args
				args.shift(1);

				const type = getArgType(args);
				switch(type) {
					case 'dnifont':
					case 'dniscript':
					case 'nts':
					case 'ots':
						var text = dnify.convert_all(args.join(' '), type, 'dniscript lm');
						dnify.replaceMsg(msg, text);
						break;
					case 'time':
						console.log(`Printed D'ni time for ${msg.author.username}`);
						python('dnitime.py', null, (err, res) => {
							if(err) throw err;
							msg.channel.send(res);
						});
						break;
					case 'translate':
						translate(msg, args);
						break;
					default:
						// Never reached
				}
			}
		}
	} catch(err) {
		msg.channel.send('Sorry, something unexpected happened.');
		console.error(err);
	}
});

client.login(require('./config.json').token);

