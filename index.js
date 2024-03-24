const { Client, Collection, MessageEmbed } = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require("fs");
const config = require("./config.json");
const express = require('express');



const Assistant = new Client({
    intents: 32767
});





Assistant.commands = new Collection();
Assistant.slash_commands = new Collection();
Assistant.aliases = new Collection();
Assistant.events = new Collection();
Assistant.categories = fs.readdirSync("./commands");


module.exports = Assistant;
if(!Assistant) return


["prefix", "event"].forEach(handler => {
    require(`./handlers/${handler}`)(Assistant);
});


process.on('unhandledRejection', err => {
    console.log(`[ERROR] Unhandled promise rejection: ${err.message}.`);
    console.log(err);
});


const AUTH = process.env.TOKEN || config.Assistant.TOKEN;
if (!AUTH) {
    console.warn("[WARN] You need to provide a Bot token!").then(async () => process.exit(1));
} else {
    Assistant.login(AUTH).catch(() => console.log("[WARN] It seems like the token is invalid, please recheck it. If the this error stills showing, then enable the 3 Gateaway Intents."));
}