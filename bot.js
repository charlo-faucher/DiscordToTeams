const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const express = require('express');
const app = express();
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const powerAutomateUrl = process.env.POWER_AUTOMATE_URL; // L'URL générée par Power Automate

app.get('/keep-alive', (req, res) => {
    res.send('Alive');
});

client.login(process.env.DISCORD_TOKEN);

client.once('ready', () => {
    console.log('Bot connecté à Discord !');
});

client.on('disconnect', async () => {
    console.log('Bot disconnected, attempting to reconnect...');
    await client.login(process.env.DISCORD_TOKEN);
});

client.on('reconnecting', () => {
    console.log('Reconnecting...');
});

client.on('messageCreate', (message) => {
    if (message.channelId === process.env.CHANNEL_ID && !message.author.bot) {
        axios.post(powerAutomateUrl, {
            date: new Date(message.createdTimestamp).toLocaleDateString('fr-FR', { timeZone: 'America/New_York' }),
            time: new Date(message.createdTimestamp).toLocaleTimeString('fr-FR', { timeZone: 'America/New_York' }),
            content: message.content,
            author: message.member.nickname || message.author.username
        })
            .then(() => console.log('Message transféré à Teams'))
            .catch(error => console.error('Erreur lors du transfert du message :', error));
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});