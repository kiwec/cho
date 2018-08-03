const Discord = require('discord.js');
const text2png = require('text2png');

let client = null;

let characters = [
	[/ah(?![^<]*>)/g, '<a>'],
	[/ai(?![^<]*>)/g, '<A>'],
	[/ay(?![^<]*>)/g, '<A>'],
	[/ch(?![^<]*>)/g, '<c>'],
	[/dh(?![^<]*>)/g, '<d>'],
	[/ee(?![^<]*>)/g, '<E>'],
	[/eh(?![^<]*>)/g, '<e>'],
	[/ih(?![^<]*>)/g, '<i>'],
	[/kh(?![^<]*>)/g, '<k>'],
	[/oo(?![^<]*>)/g, '<U>'],
	[/oy(?![^<]*>)/g, '<O>'],
	[/sh(?![^<]*>)/g, '<S>'],
	[/th(?![^<]*>)/g, '<T>'],
	[/ts(?![^<]*>)/g, '<x>'],
	[/uh(?![^<]*>)/g, '<u>'],
	[/a(?![^<]*>)/g, '<å>'],
	[/d(?![^<]*>)/g, '<D>'],
	[/í(?![^<]*>)/g, '<I>'],
	[/k(?![^<]*>)/g, '<K>'],
];

function init(cl) {
	client = cl;
}

function toDnifont(OTS) {
	let newmsg = OTS;
	for(let replacement of characters) {
		newmsg = newmsg.replace(replacement[0], replacement[1]);
	}
	newmsg = newmsg.replace(/[<>]/g, '');

	return newmsg;
}

function replace(msg) {
	if(!client) {
		throw new Error('Dnify has not been initialized. Call dnify.init before dnify.replace.');
	}

	let base = msg.content.toLowerCase().substring(6);
	let newmsg = toDnifont(base);
	let image = text2png(newmsg, {
		font: '18px Dnifont',
		textColor: 'black',
		bgColor: 'white',
		padding: 10,
		output: 'buffer'
	});

	console.log(`Dnified ${msg.author.username}'s message of id ${msg.id}`);
	let attachment = new Discord.Attachment(image, `${msg.author.username}'s text.png`);
	msg.channel.send(`${msg.author.username} said : `, attachment);
	msg.delete();
}

module.exports = { init, replace };

