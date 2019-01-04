# cho

Discord bot for the Starry Expanse server.

Type `!dni` in a server with the bot for the list of commands.

OTS/NTS/other mappings are based on [this page](http://www.mystembassy.net/downloads/dnifontchart.pdf).

### Installing

```sh
npm install
```

Create config.json as such :

```json
{
	"bots": {
		"atrus": "discord bot A token here",
		"cho": "discord bot B token here"
	}
}
```

The only required bot token is "cho", if you only use the "cho" lines in `welcome_messages.json`.

node-canvas requires some dependencies you may have to install manually.
Follow [these instructions](https://github.com/Automattic/node-canvas/wiki) for more information.

python2 and python3 are required. Default python interpreter doesn't matter.

### Running

```sh
node index.js
```

