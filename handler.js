import fs from "fs";
import path from "path";
import { InteractionType } from "discord-interactions";
import { db } from "./utils/database.js";

// Commands laden
const commands = new Map();

const commandsPath = path.join(process.cwd(), "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const commandModule = await import(filePath);

    const command = commandModule.default;
    if (!command || !command.data || !command.execute) {
        console.warn(`⚠️ Command übersprungen (ungültig): ${file}`);
        continue;
    }

    commands.set(command.data.name, command);
    console.log(`✔ Command registriert: ${command.data.name}`);
}

export default async function handler(req, res) {
    // Discord Ping check (wird bei Setup benutzt)
    if (req.body.type === InteractionType.PING) {
        return res.send({ type: InteractionType.PING });
    }

    // Nur "ApplicationCommand" (Slash Commands) verarbeiten
    if (req.body.type === InteractionType.APPLICATION_COMMAND) {
        const { name } = req.body.data;

        const command = commands.get(name);
        if (!command) {
            console.error(`❌ Command nicht gefunden: ${name}`);
            return res.send({
                type: 4,
                data: { content: "Dieser Command existiert nicht mehr." }
            });
        }

        try {
            // Dummy Interaction Objekt für Webhooks
            const interaction = {
                id: req.body.id,
                token: req.body.token,
                member: req.body.member,
                user: req.body.member?.user,
                data: req.body.data,

                reply: message =>
                    res.send({
                        type: 4,
                        data: typeof message === "string"
                            ? { content: message }
                            : message
                    })
            };

            console.log(`⚡ Command ausgeführt: /${name}`);
            await command.execute(interaction, db);

        } catch (err) {
            console.error(`❌ Fehler bei /${name}:`, err);

            return res.send({
                type: 4,
                data: {
                    content: "Es ist ein Fehler aufgetreten. Bitte versuch es erneut."
                }
            });
        }
    }
}
