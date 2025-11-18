import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("vouch")
        .setDescription("Gib einer Person einen Vouch.")
        .addUserOption(o =>
            o.setName("user").setDescription("Person").setRequired(true)
        )
        .addStringOption(o =>
            o.setName("nachricht").setDescription("Optional").setRequired(false)
        ),

    async execute(interaction, db) {
        const author = interaction.user.id;
        const target = interaction.data.options[0].value;
        const message = interaction.data.options[1]?.value || null;

        if (author === target)
            return interaction.reply("Du kannst dir keinen eigenen Vouch geben.");

        await dbRun(db,
            "INSERT INTO vouches (author_id, target_id, message) VALUES (?, ?, ?)",
            [author, target, message]
        );

        interaction.reply(`🤝 Du hast <@${target}> erfolgreich gevouched.`);
    }
};

function dbRun(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, err => err ? reject(err) : resolve());
    });
}
