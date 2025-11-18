const fs = require("fs");
const { REST, Routes } = require("discord.js");
const config = require("./config.json");

// Nur clientId wird aus config.json geladen
const { clientId, guildId } = config;

// Token aus ENV
const token = process.env.TOKEN;

const commands = [];
const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
    try {
        console.log("Deploying slash commands...");

        // Wenn du GLOBAL commands willst, nimm das hier ↓
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
        );

        console.log("Slash commands registered.");
    } catch (err) {
        console.error(err);
    }
})();
