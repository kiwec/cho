
let client = null;

let characters = [
	[/'(?![^<]*>)/g, 'aps_'],
	[/\.(?![^<]*>)/g, 'period_'],
	[/th(?![^<]*>)/g, 'th_'],
	[/ih(?![^<]*>)/g, 'ih_'],
	[/ah(?![^<]*>)/g, 'ah_'],
	[/dh(?![^<]*>)/g, 'dh_'],
	[/ee(?![^<]*>)/g, 'ee_'],
	[/ch(?![^<]*>)/g, 'ch_'],
	[/ay(?![^<]*>)/g, 'ay_'],
	[/sh(?![^<]*>)/g, 'sh_'],
	[/oy(?![^<]*>)/g, 'oy_'],
	[/oo(?![^<]*>)/g, 'oo_'],
	[/j(?![^<]*>)/g, 'j_'],
	[/h(?![^<]*>)/g, 'h_'],
	[/f(?![^<]*>)/g, 'f_'],
	[/m(?![^<]*>)/g, 'm_'],
	[/a(?![^<]*>)/g, 'a_'],
	[/b(?![^<]*>)/g, 'b_'],
	[/d(?![^<]*>)/g, 'd_'],
	[/s(?![^<]*>)/g, 's_'],
	[/g(?![^<]*>)/g, 'g_'],
	[/e(?![^<]*>)/g, 'e_'],
	[/i(?![^<]*>)/g, 'i_'],
	[/w(?![^<]*>)/g, 'w_'],
	[/x(?![^<]*>)/g, 'x_'],
	[/n(?![^<]*>)/g, 'n_'],
	[/o(?![^<]*>)/g, 'o_'],
	[/p(?![^<]*>)/g, 'p_'],
	[/r(?![^<]*>)/g, 'r_'],
	[/k(?![^<]*>)/g, 'k_'],
	[/c(?![^<]*>)/g, 'c_'],
	[/l(?![^<]*>)/g, 'l_'],
	[/u(?![^<]*>)/g, 'u_'],
	[/z(?![^<]*>)/g, 'z_'],
	[/y(?![^<]*>)/g, 'y_'],
	[/v(?![^<]*>)/g, 'v_'],
	[/t(?![^<]*>)/g, 't_'],
];

function init(cl) {
	client = cl;

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

