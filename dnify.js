
let client = null;

let characters = [
	// [/a(?![^<]*>)/g, 'a_'],
];

function init(cl) {
	client = cl;

	// Prints the list of server emojis in array format
	console.log('\nPrinting available emojis...');
	for(let emoji of client.emojis.array()) {
		console.log(`[/${emoji.name.slice(0, -1)}(?![^<]*>)/g, '${emoji.name}'],`);
	}

	console.log('\nChecking required emotes availability...');
	for(let character of characters) {
		// TODO get emotes from one guild only
		// client.guilds.array()['guild_id'].emojis
		let emoji = client.emojis.find('name', character[1]);
		if(!emoji)
			throw new Error(`Character ${character[1]} is missing emoji`);

		character[2] = emoji;
	}
	console.log('All required emotes exist.');
}

function replace(msg) {
	if(!client) {
		throw new Error('Dnify has not been initialized. Call dnify.init before dnify.replace.');
	}

	let base = msg.content.toLowerCase().substring(6);
	let newmsg = base;
	for(let replacement of characters) {
		newmsg = newmsg.replace(replacement[0], replacement[2]);
	}

	if(base == newmsg) {
		console.log(`Nothing to dnify in ${msg.author.username}'s message of id ${msg.id}`);
	} else {
		console.log(`Dnified ${msg.author.username}'s message of id ${msg.id}`);
		msg.channel.send(`<${msg.author.username}> ${newmsg}`);
		msg.delete();
	}
}

module.exports = { init, replace };

