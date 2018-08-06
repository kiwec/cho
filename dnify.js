const Discord = require('discord.js');
const text2png = require('text2png');

// text : text to modify
// characters : array of [regex, replacement]
// clean : if true, remove < and > from text
function replace(text, characters, clean) {
	for(let replacement of characters) {
		text = text.replace(replacement[0], replacement[1]);
	}

	if(clean) {
		text = text.replace(/[<>]/g, '');
	}

	return text;
}

// Sets characters not in between < and > to lowercase
function lower(text) {
	return text.replace(/[[:upper:]]+(?![^<]*>)/g, match => match.toLowerCase());
}

function toBase25(base10) {
	if(base10 == '25') {
		return '|';
	}

	// Convert to base 25... Easier than expected
	let str = base10.toString(25);
	return replace(str, [
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
	]);
}

function toDniscript(text, format) {
	// Replace colors by their rivenese symbol
	// NOTE : this is Dniscript
	text = replace(text, [
		[/red/g, '<ä>'],
		[/orange/g, '<Ä>'],
		[/yellow/g, '<ö>'],
		[/green/g, '<Ö>'],
		[/blue/g, '<ü>'],
		[/purple/g, '<Ü>'],
	]);

	// Replace numbers by their base25 symbol
	text = text.replace(/\d+/g, match => toBase25(parseInt(match, 10)));

	// Convert from X format to Dnifont
	switch(format) {
		case 'dnifont':
			break;
		case 'dniscript':
			// Don't convert from Dnifont to Dniscript
			return;
		case 'nts':
			text = NTStoDnifont(lower(text));
			break;
		case 'ots':
		default:
			text = OTStoDnifont(lower(text));
	}

	// Convert Dnifont to Dniscript
	return replace(text, [
		[/å(?![^<]*>)/g, '<q>'],
		[/\'|\,(?![^<]*>)/g, '<‘>'],

		// Numerals
		[/\\(?![^<]*>)/g, '<{>'],
		[/{(?![^<]*>)/g, '<}>'],
		[/}(?![^<]*>)/g, '<\\>'],
	], true);
}

function NTStoDnifont(text) {
	return replace(text, [
		[/a(?![^<]*>)/g, '<a>'],
		[/á(?![^<]*>)/g, '<I>'],
		[/æ(?![^<]*>)/g, '<å>'],
		[/c(?![^<]*>)/g, '<x>'],
		[/ç(?![^<]*>)/g, '<c>'],
		[/d(?![^<]*>)/g, '<D>'],
		[/e(?![^<]*>)/g, '<e>'],
		[/é(?![^<]*>)/g, '<A>'],
		[/i(?![^<]*>)/g, '<i>'],
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
	], true);
}

function OTStoDnifont(text) {
	return replace(text, [
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
		[/i(?!['\w])(?![^<]*>)/g, '<E>'], // convert a final 'i' to 'ee', to account for proper nouns such as "D'ni"
		[/a(?![^<]*>)/g, '<å>'],
		[/d(?![^<]*>)/g, '<D>'],
		[/í(?![^<]*>)/g, '<I>'],
		[/k(?![^<]*>)/g, '<K>'],
	], true);
}

function replaceMsg(msg, text) {
	let image = text2png(text, {
		font: '24px Dniscript',
		localFontPath: 'dniscript.ttf',
		localFontName: 'Dniscript',
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

module.exports = { toBase25, toDniscript, replaceMsg };

