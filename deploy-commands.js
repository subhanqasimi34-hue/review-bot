import "dotenv/config";
import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";

// Ordner, wo deine JS-Commands liegen
const commandsPath = path.join(process.cwd(), "commands");

// Commands array
const commands = [];

// Alle .js Files in /commands laden
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);

    if (!command.default?.data) {
        console.warn(`⚠️ Übersprungen: ${file} hat keine "data" Eigenschaft.`);
        continue;
    }

    commands.push(command.default.data.toJSON());
    console.log(`✔️ Command geladen: ${command.default.data.name}`);
}

// Discord REST Client
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

// Global oder Guild?
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID; // Optional

async function deploy() {
    try {
        console.log("🚀 Starte Deployment…");

        if (GUILD_ID) {
            // Guild Commands (Direkt, instant update)
            await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
                { body: commands }
            );
            console.log("✅ Guild Commands erfolgreich deployed!");
        } else {
            // Globale Commands (können 30-60 Minuten brauchen)
            await rest.put(
                Routes.applicationCommands(CLIENT_ID),
                { body: commands }
            );
            console.log("🌍 Globale Commands erfolgreich deployed!");
        }

        console.log("🎉 Fertig!");
    } catch (err) {
        console.error("❌ Fehler beim Deployen:", err);
    }
}

deploy();
