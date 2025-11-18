
import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import fs from "fs";
import path from "path";

const config = JSON.parse(fs.readFileSync("./config.json"));
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel]
});

client.commands = new Collection();

const cmdPath = "./commands";
for (const file of fs.readdirSync(cmdPath)) {
  const cmd = await import(`./commands/${file}`);
  client.commands.set(cmd.data.name, cmd);
}

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand() && !interaction.isModalSubmit()) return;

  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (command) return command.execute(interaction);
  }

  if (interaction.isModalSubmit()) {
    const modalHandler = client.commands.get("review_user");
    if (modalHandler) return modalHandler.handleModal(interaction);
  }
});

client.on("ready",()=>console.log(`Logged in as ${client.user.tag}`));
client.login(config.token);
