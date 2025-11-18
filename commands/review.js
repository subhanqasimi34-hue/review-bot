const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("review_user").setDescription("Submit a review for a helper."),

    async execute(interaction) {
        const modal = new ModalBuilder().setCustomId("reviewModal").setTitle("Submit Review");

        modal.addComponents(
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("helperInput").setLabel("Helper (mention or ID)").setRequired(true).setStyle(TextInputStyle.Short)),
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("ratingInput").setLabel("Rating (1–5)").setRequired(true).setStyle(TextInputStyle.Short)),
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("categoryInput").setLabel("Category (ingame, ticket, chat, voice)").setRequired(true).setStyle(TextInputStyle.Short)),
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("commentInput").setLabel("Comment").setRequired(true).setStyle(TextInputStyle.Paragraph))
        );

        await interaction.showModal(modal);
    },

    async handleModal(interaction, client) {
        if (interaction.customId !== "reviewModal") return;

        const helperInput = interaction.fields.getTextInputValue("helperInput");
        const ratingInput = interaction.fields.getTextInputValue("ratingInput");
        const categoryInput = interaction.fields.getTextInputValue("categoryInput").toLowerCase();
        const commentInput = interaction.fields.getTextInputValue("commentInput");

        const validCategories = ["ingame", "ticket", "chat", "voice"];
        if (!validCategories.includes(categoryInput))
            return interaction.reply({ content: "Invalid category.", ephemeral: true });

        const helperId = helperInput.replace(/[<@>]/g, "");
        const rating = parseInt(ratingInput);

        if (isNaN(rating) || rating < 1 || rating > 5)
            return interaction.reply({ content: "Rating must be 1–5.", ephemeral: true });

        client.db.run("INSERT INTO reviews (reviewer, helper, rating, category, comment) VALUES (?, ?, ?, ?, ?)",
            [interaction.user.id, helperId, rating, categoryInput, commentInput]
        );

        const stars = "⭐".repeat(rating) + "☆".repeat(5 - rating);

        const embed = new EmbedBuilder()
            .setTitle("⭐ New Review Submitted")
            .addFields(
                { name: "Reviewer", value: `<@${interaction.user.id}>`, inline: true },
                { name: "Helper", value: `<@${helperId}>`, inline: true },
                { name: "Rating", value: stars, inline: true },
                { name: "Category", value: categoryInput, inline: true },
                { name: "Comment", value: commentInput }
            )
            .setColor("Yellow");

        await interaction.reply({ embeds: [embed] });
    }
};