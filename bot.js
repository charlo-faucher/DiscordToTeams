const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const express = require('express');
require('dotenv').config();

// Dummy express server to stop Render port warnings
const app = express();
const port = process.env.PORT || 3000;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const powerAutomateUrl = process.env.POWER_AUTOMATE_URL; // L'URL générée par Power Automate

client.once('ready', () => {
    console.log('Bot connecté à Discord !');
});


client.on('messageCreate', (message) => {
    if (message.channelId === process.env.CHANNEL_ID && !message.author.bot) {
        axios.post(powerAutomateUrl, {
            content: message.content,
            author: message.author.username
        })
            .then(() => console.log('Message transféré à Teams'))
            .catch(error => console.error('Erreur lors du transfert du message :', error));
    }
});

client.login(process.env.DISCORD_TOKEN);

app.get('/', (req, res) => res.send('Bot is running!'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});