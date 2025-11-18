import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("review")
        .setDescription("Gib einer Person eine Bewertung.")
        .addUserOption(o =>
            o.setName("user").setDescription("Person").setRequired(true)
        )
        .addIntegerOption(o =>
            o.setName("rating").setDescription("Bewertung 1-5").setRequired(true)
        )
        .addStringOption(o =>
            o.setName("kommentar").setDescription("Kommentar").setRequired(false)
        ),

    async execute(interaction, db) {
        const author = interaction.user.id;
        const target = interaction.data.options[0].value;
        const rating = interaction.data.options[1].value;
        const text = interaction.data.options[2]?.value || null;

        if (author === target)
            return interaction.reply("Du kannst dich nicht selbst bewerten.");

        await dbRun(db,
            "INSERT INTO reviews (author_id, target_id, rating, comment) VALUES (?, ?, ?, ?)",
            [author, target, rating, text]
        );

        interaction.reply(`👍 Deine Bewertung für <@${target}> wurde gespeichert.`);
    }
};

function dbRun(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, err => err ? reject(err) : resolve());
    });
}
