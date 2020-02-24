# cho

Discord bot for the Starry Expanse server.

Type `!dni` in a server with the bot for the list of commands.

OTS/NTS/other mappings are based on [this page](http://www.mystembassy.net/downloads/dnifontchart.pdf).

### Installing

```sh
npm install
```

node-canvas requires some dependencies you may have to install manually.
Follow [these instructions](https://github.com/Automattic/node-canvas/wiki) for more information.

python2 and python3 are required. Default python interpreter doesn't matter.

### Running

```sh
CHO_TOKEN="..." ATRUS_TOKEN="..." GEHN_TOKEN="..." node index.js
```

The only required token is "CHO_TOKEN", if you only use the "cho" lines in `welcome_messages.json`.
