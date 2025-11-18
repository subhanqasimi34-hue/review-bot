const fs = require("fs");
const path = require("path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const sqlite3 = require("sqlite3").verbose();
const config = require("./config.json");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

const db = new sqlite3.Database("./database.db", err => {
    if (err) return console.error(err);
    console.log("SQLite database loaded.");
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reviewer TEXT,
        helper TEXT,
        rating INTEGER,
        category TEXT,
        comment TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS vouches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        helper TEXT
    )`);
});

client.db = db;

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand() && !interaction.isModalSubmit()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        if (interaction.isChatInputCommand()) {
            await command.execute(interaction, client);
        } else if (interaction.isModalSubmit()) {
            await command.handleModal?.(interaction, client);
        }
    } catch (err) {
        console.error(err);
        await interaction.reply({ content: "An error occurred.", ephemeral: true });
    }
});

client.once("ready", () => {
    console.log(`Bot logged in as ${client.user.tag}`);
});

// 🔥 Wichtig: Nutzt ENV Token statt config.json
client.login(process.env.TOKEN);
