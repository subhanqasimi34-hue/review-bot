import db from "../utils/database.js";
import { EmbedBuilder } from "discord.js";

export default async function handleVouch(interaction) {
    const target = interaction.options.getUser("user");

    if (!target) {
        return interaction.reply({
            content: "❌ You must select a user to vouch for.",
            ephemeral: true
        });
    }

    if (target.id === interaction.user.id) {
        return interaction.reply({
            content: "❌ You cannot vouch for yourself.",
            ephemeral: true
        });
    }

    // +10 Punkte eintragen
    await db.run(
        "INSERT INTO points (userID, points, source) VALUES (?, ?, ?)",
        [target.id, 10, "vouch"]
    );

    // Embed
    const embed = new EmbedBuilder()
        .setColor(0x00ff6a)
        .setTitle("New Vouch")
        .setThumbnail(target.displayAvatarURL())
        .addFields(
            { name: "User", value: `${target}`, inline: true },
            { name: "Given by", value: `${interaction.user}`, inline: true },
            { name: "Points Added", value: `+10`, inline: true }
        )
        .setFooter({ text: "Vouch System" })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
