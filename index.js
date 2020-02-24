const Discord = require('discord.js');
const PythonShell = require('python-shell');
const dnify = require('./dnify.js');
const welcome = require('./welcome.js');

let clients = {};

async function init() {
	if(!process.env.CHO_TOKEN) {
		throw new Error("The 'CHO_TOKEN' environment variable is required.");
	}

	for(let bot_name of ["cho", "atrus", "gehn"]) {
		// To allow being run from Heroku, bot tokens are stored in environment variables.
		// As an example, Cho's token is in the "CHO_TOKEN" environment variable.
		const bot_token = process.env[`${bot_name.toUpperCase()}_TOKEN`];
		if(bot_token) {
			clients[bot_name] = new Discord.Client();
			clients[bot_name].on('ready', () => console.log(`${clients[bot_name].user.tag} is now logged in.`));
			clients[bot_name].on('error', console.error);
			await clients[bot_name].login(bot_token);
		}
	}

	clients.cho.on('guildMemberAdd', member => welcome(clients, member, 'joined'));
	clients.cho.on('guildMemberRemove', member => welcome(clients, member, 'left'));

	clients.cho.on('message', msg => {
		try {
			if(msg.content.indexOf('!dni') == 0) {
				let args = msg.content.split(' ');

				if(args.length == 1) {
					print_help(msg);
				} else {
					// Remove "!dni " from args
					args.shift();

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
}

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
			return args.shift();
		case 'time':
			return 'time';
		case 'translate':
			return args.shift();
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

init();
