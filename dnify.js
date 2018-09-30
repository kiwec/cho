const Discord = require('discord.js');
const text2png = require('text2png');

const letter_translation_table = [
	// This table is used to translate between :
	// - OTS : Old Transliteration Standard
	// - NTS : New Transliteration Standard
	// - DNF : Dnifont
	// - DNS : D'ni Script
	// - DNS LM : D'ni Script LM

	// OTS | NTS | DNF | DNS | DNS LM
	[  'ah', 'a',  'a',  'a',  'a' ],
	[  'ai', 'é',  'A',  'A',  'ê' ],
	[  'ch', 'ç',  'c',  'c',  'ç' ],
	[  'dh', 'ð',  'd',  'd',  'ð' ],
	[  'ee', 'í',  'E',  'E',  'î' ],
	[  'eh', 'e',  'e',  'e',  'e' ],
	[  'kh', 'x',  'k',  'k',  'x' ],
	[  'oo', 'ú',  'U',  'U',  'û' ],
	[  'oy', 'ó',  'O',  'O',  'ô' ],
	[  'sh', 'š',  'S',  'S',  'š' ],
	[  'th', 'þ',  'T',  'T',  'þ' ],
	[  'ts', 'c',  'x',  'x',  'c' ],
	[  'uh', 'u',  'u',  'u',  'u' ],
	[  '-',  '~',  '-',  '-',  '-' ],
	[  '.',  '.',  '.',  '.',  '.' ],
	[  '\'', '\'', '\'', '‘',  '‘' ],
	[  'a',  'æ',  'å',  'q',  'æ' ],
	[  'b',  'b',  'b',  'b',  'b' ],
	[  'd',  'd',  'D',  'D',  'd' ],
	[  'f',  'f',  'f',  'f',  'f' ],
	[  'g',  'g',  'g',  'g',  'g' ],
	[  'h',  'h',  'h',  'h',  'h' ],
	[  'í',  'á',  'I',  'I',  'I' ],
	[  'i',  'i',  'i',  'i',  'i' ],
	[  'j',  'j',  'j',  'j',  'j' ],
	[  'k',  'k',  'K',  'K',  'k' ],
	[  'l',  'l',  'l',  'l',  'l' ],
	[  'm',  'm',  'm',  'm',  'm' ],
	[  'n',  'n',  'n',  'n',  'n' ],
	[  'o',  'o',  'o',  'o',  'o' ],
	[  'p',  'p',  'p',  'p',  'p' ],
	[  'r',  'r',  'r',  'r',  'r' ],
	[  's',  's',  's',  's',  's' ],
	[  't',  't',  't',  't',  't' ],
	[  'v',  'v',  'v',  'v',  'v' ],
	[  'w',  'w',  'w',  'w',  'w' ],
	[  'y',  'y',  'y',  'y',  'y' ],
	[  'z',  'z',  'z',  'z',  'z' ],
];

const number_translation_table = [
	// This table is used to translate between :
	// - B25 : Base 25 number
	// - DNF : Dnifont
	// - DNS : D'ni Script
	// - DNS LM : D'ni Script LM

	// B25 | DNF | DNS | DNS LM
	[  '0',  '0',  '0',  '0' ],
	[  '1',  '1',  '1',  '1' ],
	[  '2',  '2',  '2',  '2' ],
	[  '3',  '3',  '3',  '3' ],
	[  '4',  '4',  '4',  '4' ],
	[  '5',  '5',  '5',  '5' ],
	[  '6',  '6',  '6',  '6' ],
	[  '7',  '7',  '7',  '7' ],
	[  '8',  '8',  '8',  '8' ],
	[  '9',  '9',  '9',  '9' ],
	[  'a',  ')',  ')',  ')' ],
	[  'b',  '!',  '!',  '!' ],
	[  'c',  '@',  '@',  '@' ],
	[  'd',  '#',  '#',  '#' ],
	[  'e',  '$',  '$',  '$' ],
	[  'f',  '%',  '%',  '%' ],
	[  'g',  '^',  '^',  '^' ],
	[  'h',  '&',  '&',  '&' ],
	[  'i',  '*',  '*',  '*' ],
	[  'j',  '(',  '(',  '(' ],
	[  'k',  '[',  '[',  '[' ],
	[  'l',  ']',  ']',  ']' ],
	[  'm', '\\',  '{',  '{' ],
	[  'n',  '{',  '}',  '}' ],
	[  'o',  '}', '\\', '\\' ],
];

const color_translation_table = [
	// This table is used to translate between :
	// - English : the name of the color
	// - DNS : D'ni Script
	// - DNS LM : D'ni Script LM

	// English | DNS | DNS LM
	[ 'red',     'ä',   'ä' ],
	[ 'orange',  'Ä',   'Ä' ],
	[ 'yellow',  'ö',   'ö' ],
	[ 'green',   'Ö',   'Ö' ],
	[ 'blue',    'ü',   'ü' ],
	[ 'purple',  'Ü',   'Ü' ],
];

// Convert text between multiple formats
// Available formats : 'ots', 'nts', 'dnifont', 'dniscript', 'dniscript lm'
function convert_text(text, format_from, format_to) {
	const formats = ['ots', 'nts', 'dnifont', 'dniscript', 'dniscript lm'];
	let from = formats.indexOf(format_from);
	if(from == -1) throw new Error(`Invalid format "${format_from}"`);
	let to = formats.indexOf(format_to);
	if(to == -1) throw new Error(`Invalid format "${format_to}"`);

	// Convert to lowercase when possible
	if(['ots', 'nts', 'dniscript lm'].includes(format_from)) {
		text = lower(text);
	}

	// Convert a final 'i' to 'ee', to account for proper nouns such as "D'ni"
	if(format_from == 'ots') {
		text = text.replace(/i(?!['\w])(?![^<]*>)/g, 'ee');
	}

	for(let line of letter_translation_table) {
		// Handle special characters
		let character = line[from];
		if(character.length == 1) {
			character = '[' + character + ']';
		}
		
		let regex = new RegExp(character + '(?![^<]*>)', 'g');
		text = text.replace(regex, match => '<' + line[to] + '>');
	}

	return text;
}

// Convert a number between multiple formats
// Available formats : 'base10', 'base25', 'dnifont', 'dniscript', 'dniscript lm'
function convert_number(number, format_from, format_to) {
	const formats = ['base25', 'dnifont', 'dniscript', 'dniscript lm'];
	let from = format_from == 'base10' ? 0 : formats.indexOf(format_from);
	if(from == -1) throw new Error(`Invalid format "${format_from}"`);
	let to = format_to == 'base10' ? 0 : formats.indexOf(format_to);
	if(to == -1) throw new Error(`Invalid format "${format_to}"`);
	
	// Ensure we are in a valid format
	if(format_from == 'base10') {
		// Convert to base25
		number = parseInt(number, 10).toString(25);
	}

	for(let line of number_translation_table) {
		let regex = new RegExp('[' + line[from] + '](?![^<]*>)', 'g');
		number = number.replace(regex, match => '<' + line[to] + '>');
	}

	// Convert to base10 if needed
	if(format_to == 'base10') {
		number = '<' + parseInt(clean(number), 25).toString(10) + '>';
	}

	return number;
}

// Convert a color between multiple formats
// Available formats : 'english', 'dniscript', 'dniscript lm'
function convert_color(color, format_from, format_to) {
	const formats = ['english', 'dniscript', 'dniscript lm'];
	let from = formats.indexOf(format_from);
	if(from == -1) throw new Error(`Invalid format "${format_from}"`);
	let to = formats.indexOf(format_to);
	if(to == -1) throw new Error(`Invalid format "${format_to}"`);

	for(let line of color_translation_table) {
		let regex = new RegExp(line[from] + '(?![^<]*>)', 'gi');
		color = color.replace(regex, match => '<' + line[to] + '>');
	}

	return color;
}

// Removes symbols left from the conversion
function clean(text) {
	return text.replace(/[<>]/g, '');
}

// Sets characters not in between < and > to lowercase
function lower(text) {
	return text.replace(/[[:upper:]]+(?![^<]*>)/g, match => match.toLowerCase());
}

function convert_all(text, format_from, format_to) {
	// Convert colors to rivenese symbols
	text = convert_color(text, 'english', format_to);

	// Convert numbers to base25 symbols
	text = text.replace(/\d+/g, match => {
		return convert_number(match, 'base10', format_to);
	});

	// Convert the rest of the text
	text = convert_text(text, format_from, format_to);
	text = clean(text);
	return text;
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

module.exports = { convert_text, convert_number, convert_color, convert_all, clean, lower, replaceMsg };

