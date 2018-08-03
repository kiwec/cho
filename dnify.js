const Discord = require('discord.js');
const text2png = require('text2png');

function toBase25(base10) {
	if(base10 == '25') {
		return '|';
	}

	// Convert to base 25... Easier than expected
	let str = base10.toString(25);

	// Numerals differ slightly in dniscript TODO
	let table = [
		[/a(?![^<]*>)/g, ')'],
		[/b(?![^<]*>)/g, '!'],
		[/c(?![^<]*>)/g, '@'],
		[/d(?![^<]*>)/g, '#'],
		[/e(?![^<]*>)/g, '$'],
		[/f(?![^<]*>)/g, '%'],
		[/g(?![^<]*>)/g, '^'],
		[/h(?![^<]*>)/g, '&'],
		[/i(?![^<]*>)/g, '*'],
		[/j(?![^<]*>)/g, '('],
		[/k(?![^<]*>)/g, '['],
		[/l(?![^<]*>)/g, ']'],
		[/m(?![^<]*>)/g, '\\'],
		[/n(?![^<]*>)/g, '{'],
		[/o(?![^<]*>)/g, '}'],
	];

	for(let number of table) {
		str = str.replace(number[0], number[1]);
	}

	return str;
}

// Must be called before XtoDnifont for color handling
function miscToDnifont(text) {
	// Fix uppercase being detected as dnifont
	// Later : maybe check for uppercase instead ? TODO
	text = text.toLowerCase();

	// Replace numbers by their base25 symbol
	text = text.replace(/\d+/g, match => toBase25(parseInt(match, 10)));

	/*
	 * // Commented : this is D'ni Script, not Dnifont
	 * // TODO switch to dniscript maybe ?
	 *
	// Replace colors by their rivenese symbol
	text = text.replace(/red/g, '<ä>');
	text = text.replace(/orange/g, '<Ä>');
	text = text.replace(/yellow/g, '<ö>');
	text = text.replace(/green/g, '<Ö>');
	text = text.replace(/blue/g, '<ü>');
	text = text.replace(/purple/g, '<Ü>');
	*/

	return text;
}

function NTStoDnifont(text) {
	text = miscToDnifont(text);

	const characters = [
		[/ay(?![^<]*>)/g, '<A>'],
		[/ih(?![^<]*>)/g, '<i>'],
		[/á(?![^<]*>)/g, '<I>'],
		[/a(?![^<]*>)/g, '<a>'],
		[/æ(?![^<]*>)/g, '<å>'], // would be q in dniscript TODO
		[/c(?![^<]*>)/g, '<x>'],
		[/ç(?![^<]*>)/g, '<c>'],
		[/d(?![^<]*>)/g, '<D>'],
		[/e(?![^<]*>)/g, '<e>'],
		[/é(?![^<]*>)/g, '<A>'],
		[/í(?![^<]*>)/g, '<E>'],
		[/k(?![^<]*>)/g, '<K>'],
		[/ð(?![^<]*>)/g, '<d>'],
		[/ó(?![^<]*>)/g, '<O>'],
		[/š(?![^<]*>)/g, '<S>'],
		[/u(?![^<]*>)/g, '<u>'],
		[/ú(?![^<]*>)/g, '<U>'],
		[/x(?![^<]*>)/g, '<k>'],
		[/þ(?![^<]*>)/g, '<T>'],
		[/~(?![^<]*>)/g, '<->'],
	];

	for(let replacement of characters) {
		text = text.replace(replacement[0], replacement[1]);
	}
	text = text.replace(/[<>]/g, '');

	return text;
}

function OTStoDnifont(text) {
	text = miscToDnifont(text);

	const characters = [
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
		[/a(?![^<]*>)/g, '<å>'], // would be q in dniscript TODO
		[/d(?![^<]*>)/g, '<D>'],
		[/í(?![^<]*>)/g, '<I>'],
		[/k(?![^<]*>)/g, '<K>'],
	];

	for(let replacement of characters) {
		text = text.replace(replacement[0], replacement[1]);
	}
	text = text.replace(/[<>]/g, '');

	return text;
}

function replaceMsg(msg, text) {
	let image = text2png(text, {
		font: '18px Dnifont',
		textColor: 'black',
		bgColor: 'white',
		padding: 10,
		output: 'buffer'
	});

	console.log(`Dnified ${msg.author.username}'s message of id ${msg.id}`);
	let attachment = new Discord.Attachment(image, `${msg.author.username}'s text.png`);

	if(msg.guild.me.hasPermission('MANAGE_MESSAGES')) {
		msg.channel.send(`${msg.author.username} said : `, attachment);
		msg.delete();
	} else {
		msg.channel.send('', attachment);
	}
}

module.exports = { toBase25, OTStoDnifont, NTStoDnifont, replaceMsg };

