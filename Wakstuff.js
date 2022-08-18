
//#region Imports & requires
const i18next = require('i18next');
const { Client, Intents } = require('discord.js');
const MongoClient = require('mongodb').MongoClient;
const fs = require("fs");
const fetch = require("node-fetch");
let cheerio = require ('cheerio');
let jsonframe = require ('jsonframe-cheerio');
const axios = require('axios').default;
const dotenv = require("dotenv")
const Option = require("./assets/Classes/Option");
dotenv.config();
//#endregion

//#region const declarations
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const default_prefix = "w!";
const uri = "mongodb+srv://" + process.env['db_user'] + ":" +  process.env['db_pass'] + "@" +  process.env['db_name'] + ".unr6gk4.mongodb.net/?retryWrites=true&w=majority";
const mongo_client = new MongoClient(uri, { useNewUrlParser: true });
let mongo_collection;

mongo_client.connect(err => {
    if(err) throw err;
    mongo_collection = mongo_client.db("Wakstuff").collection("guilds");
});

const list_items = []

const sorted_ids = [31, 56, 41, 57, 191, 192, 161, 160, 184, 20, 166, 162, 167, 163, 175, 174, 173, 174, 176, 171, 150, 168, 126, 875, 120, 130, 122, 132, 123, 124, 125, 149, 151, 1068, 26, 180, 181, 1050, 1051, 1052, 1053, 1055, 1056, 1060, 1061, 80, 100, 1069, 82, 97, 83, 98, 84, 96, 85, 71, 988, 1062, 1063, 234, 2000, 2001, 2002, 2006, 2008]
const debuff_ids = [56, 57, 96, 97, 98, 100, 130, 132, 161, 167, 168, 172, 174, 176, 181, 192, 194, 876, 1056, 1060, 1061, 1062, 1063]

let prefix = "";
//#endregion

//#region init
eval(fs.readFileSync('./functions/i18n/i18n.js') + '');
eval(fs.readFileSync('./functions/functions.js') + '');
init_i18n();
load_itemslist();
 //#endregion

 //#region booting

 client.once('ready', () => {
     console.log("ready to serve");
 })

 eval(fs.readFileSync('./functions/commands/commands.js') + '');
 client.login(process.env["token"]);
 //#endregion
