
let client = null;

const characters = [
	// ['a', '<a_:snowflakeid>'],
];

function init(cl) {
	client = cl;

	// Prints the list of server emojis in array format
	console.log('\nPrinting available emojis...');
	for(let emoji of client.emojis.array()) {
		console.log("['" + emoji.name.slice(0, -1) + "', '<" + emoji.identifier + ">'],");
	}

	console.log('\nChecking required emotes availability...');
	let emojis = client.emojis.array();
	for(let character of characters) {
		let valid = false;

		for(let emoji of emojis) {
			if(character[1] == '<' + emoji.identifier + '>') {
				valid = true;
				break;
			}
		}

		if(!valid) {
			throw new Error(`Character ${character[0]} is missing emoji ${character[1]}`);
		}
	}
	console.log('All required emotes exist.');
}

function replace(msg) {
	if(!client) {
		throw new Error('Dnify has not been initialized. Call dnify.init before dnify.replace.');
	}

	let newmsg = msg.content;
	for(let replacement of characters) {
		newmsg = newmsg.replace(replacement[0], replacement[1]);
	}

	if(msg.content != newmsg) {
		console.log(`Dnified ${msg.author.username}'s message of id ${msg.id}`);
		msg.edit(newmsg);
	}
}

module.exports = { init, replace };

