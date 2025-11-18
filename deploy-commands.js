
import { REST, Routes } from "discord.js";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("./config.json"));
const commands=[];

for(const file of fs.readdirSync("./commands")){
  const cmd=await import(`./commands/${file}`);
  commands.push(cmd.data.toJSON());
}

const rest=new REST({version:"10"}).setToken(config.token);

(async()=>{
  await rest.put(Routes.applicationCommands(config.clientId),{body:commands});
  console.log("Commands deployed");
})();
