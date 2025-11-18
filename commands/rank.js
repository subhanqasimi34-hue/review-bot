import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Zeigt deinen Punktestand.")
        .addUserOption(o =>
            o.setName("user").setDescription("Optional").setRequired(false)
        ),

    async execute(interaction, db) {
        const target = interaction.data.options?.[0]?.value || interaction.user.id;

        const row = await dbGet(db,
            "SELECT points FROM points WHERE user_id = ?",
            [target]
        );

        interaction.reply(`<@${target}> hat **${row?.points || 0} Punkte**.`);
    }
};

function dbGet(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
    });
}
