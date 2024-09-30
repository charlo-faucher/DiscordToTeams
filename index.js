const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const powerAutomateUrl = process.env.POWER_AUTOMATE_URL; // URL for Power Automate

module.exports = async function (context, req) {
    // Start the bot if it's not already running
    if (!client.isReady()) {
        client.once('ready', () => {
            console.log('Bot connected to Discord!');
        });

        client.on('messageCreate', async (message) => {
            if (message.channelId === process.env.CHANNEL_ID && !message.author.bot) {
                const member = await message.guild.members.fetch(message.author);

                axios.post(powerAutomateUrl, {
                    content: message.content,
                    author: member ? member.nickname : message.author.username
                })
                    .then(() => console.log('Message forwarded to Teams'))
                    .catch(error => console.error('Error forwarding the message:', error));
            }
        });

        // Log in to Discord
        await client.login(process.env.DISCORD_TOKEN);
    }

    context.res = {
        status: 200,
        body: "Bot is running and listening for messages."
    };
};
