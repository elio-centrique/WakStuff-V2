const i18next = require('i18next');

const dotenv = require("dotenv")
dotenv.config();

const { REST } = require('@discordjs/rest');
const { SlashCommandBuilder, Routes } = require('discord.js');
const client_id = process.env.client_id;
const guild_id = process.env.guild_id;

const commands = [
    new SlashCommandBuilder()
        .setName('language')
        .setNameLocalization('fr','langue')
        .setDescriptionLocalization('fr', 'Change la langue du bot pour ce serveur')
        .setDescription('change the bot language for this Guild')
        .addStringOption(option =>
            option
                .setName("language")
                .setNameLocalization('fr', 'langue')
                .setDescription('the chosen language')
                .setDescriptionLocalization('fr', 'la langue souhaitée')
                .setRequired(true))
        .setDMPermission(false),

    new SlashCommandBuilder()
        .setName('search')
        .setNameLocalization('fr', 'chercher')
        .setDescriptionLocalization('fr', 'Affiche les informations d\'un équipement choisi ')
        .setDescription('search the information for the chosen gear')
        .setDMPermission(false)
        .addStringOption(option =>
            option
                .setName('gear')
                .setNameLocalization('fr', 'équipement')
                .setDescriptionLocalization('fr', 'l\'équipement recherché')
                .setDescription('The chosen gear')
                .setRequired(true)
                .setAutocomplete(true)),

    new SlashCommandBuilder()
        .setName('compare')
        .setNameLocalization('fr', 'comparer')
        .setDescriptionLocalization('fr', 'Compare deux équipements différents')
        .setDescription('compare two different gears')
        .setDMPermission(false)
        .addStringOption(option =>
            option
                .setName('gear_1')
                .setNameLocalization('fr', 'équipement_1')
                .setDescriptionLocalization('fr', 'l\'équipement recherché N°1')
                .setDescription('The first chosen gear')
                .setRequired(true)
                .setAutocomplete(true))
        .addStringOption(option =>
            option
                .setName('gear_2')
                .setNameLocalization('fr', 'équipement_2')
                .setDescriptionLocalization('fr', 'l\'équipement recherché N°2')
                .setDescription('The second chosen gear')
                .setRequired(true)
                .setAutocomplete(true)),

    new SlashCommandBuilder()
        .setName('help')
        .setNameLocalization('fr', "aide")
        .setDescription('Display the help of commands')
        .setDescriptionLocalization('fr', 'Affiche l\'aide des commandes'),

    new SlashCommandBuilder()
        .setName('almanax')
        .setNameLocalization('fr', 'almanax')
        .setDescription('Display current day\'s almanax in this channel')
        .setDescriptionLocalization('fr', 'Affiche l\'almanax du jour dans le canal actuel'),

].map(command => command.toJSON());


const private_commands = [
    new SlashCommandBuilder()
        .setName('stats')
        .setDescription('show my beautiful stats to my Souague owner'),

    new SlashCommandBuilder()
        .setName('update')
        .setNameLocalization('fr', 'maj')
        .setDescriptionLocalization('fr', 'Envoie un message à tous les serveurs de la langue choisie')
        .setDescription('send a message to all servers')
        .addStringOption(option =>
            option
                .setName('language')
                .setNameLocalization('fr', 'langue')
                .setDescriptionLocalization('fr', 'La langue choisie')
                .setDescription('The language of the message')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('message')
                .setNameLocalization('fr', 'message')
                .setDescriptionLocalization('fr', 'le message à envoyer')
                .setDescription('The message to send')
                .setRequired(true))

].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.token);

rest.put(Routes.applicationGuildCommands(client_id, guild_id), { body: [] })
    .then(() => console.log('Successfully deleted all guild commands.'))
    .catch(console.error);

rest.put(Routes.applicationGuildCommands(client_id, guild_id), { body: private_commands })
    .then(() => console.log('Successfully reloaded application (/) commands.'))
    .catch(console.error);


rest.put(Routes.applicationCommands(client_id), { body: [] })
    .then(() => console.log('Successfully deleted application commands.'))
    .catch(console.error);

rest.put(Routes.applicationCommands(client_id), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);



