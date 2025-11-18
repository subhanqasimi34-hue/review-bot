import db from "../utils/database.js";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

// Badge system
function getBadge(points) {
    if (points >= 5000) return "🏆 Champion";
    if (points >= 3000) return "👑 Emerald";
    if (points >= 2000) return "🔥 Ruby";
    if (points >= 1000) return "💎 Diamond";
    if (points >= 500) return "🥇 Gold";
    if (points >= 200) return "🥈 Silver";
    if (points >= 50) return "🥉 Bronze";
    return "🪙 Unranked";
}

export default async function handleProfile(interaction) {
    const target =
        interaction.options.getUser("user")?.id ||
        interaction.user.id;

    const stats = await db.get(
        "SELECT SUM(points) AS total FROM points WHERE userID = ?",
        [target]
    );

    const totalPoints = stats?.total || 0;
    const badge = getBadge(totalPoints);

    // Get reviews
    const reviews = await db.all(
        "SELECT * FROM reviews WHERE targetID = ? ORDER BY id DESC",
        [target]
    );

    if (!reviews || reviews.length === 0) {
        const embed = new EmbedBuilder()
            .setTitle(`📘 Profile of <@${target}>`)
            .setColor(0x0099ff)
            .setDescription("This user has no reviews yet.")
            .addFields(
                { name: "Points", value: `${totalPoints}`, inline: true },
                { name: "Rank", value: badge, inline: true }
            );

        return interaction.reply({ embeds: [embed], ephemeral: false });
    }

    // Pagination settings
    let page = 0;
    const reviewsPerPage = 3;
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    function generatePageEmbed(pageIndex) {
        const start = pageIndex * reviewsPerPage;
        const end = start + reviewsPerPage;
        const slice = reviews.slice(start, end);

        const embed = new EmbedBuilder()
            .setTitle(`📘 Profile of <@${target}>`)
            .setColor(0x0099ff)
            .addFields(
                { name: "Points", value: `${totalPoints}`, inline: true },
                { name: "Rank", value: badge, inline: true },
                { name: "Total Reviews", value: `${reviews.length}`, inline: true }
            );

        let desc = "";

        for (const r of slice) {
            desc += `⭐ **${r.stars}** — *${r.category}*\nReviewer: <@${r.reviewerID}>\n\n`;
        }

        embed.setDescription(desc);
        embed.setFooter({ text: `Page ${pageIndex + 1} / ${totalPages}` });

        return embed;
    }

    const backBtn = new ButtonBuilder()
        .setCustomId("profile_prev")
        .setLabel("Previous")
        .setStyle(ButtonStyle.Primary);

    const nextBtn = new ButtonBuilder()
        .setCustomId("profile_next")
        .setLabel("Next")
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(backBtn, nextBtn);

    await interaction.reply({
        embeds: [generatePageEmbed(page)],
        components: [row],
        ephemeral: false
    });

    const collector = interaction.channel.createMessageComponentCollector({
        time: 120_000
    });

    collector.on("collect", async (btn) => {
        if (btn.user.id !== interaction.user.id) {
            return btn.reply({ content: "❌ Only the command user can scroll.", ephemeral: true });
        }

        if (btn.customId === "profile_prev") {
            page = page <= 0 ? totalPages - 1 : page - 1;
        } else if (btn.customId === "profile_next") {
            page = page >= totalPages - 1 ? 0 : page + 1;
        }

        await btn.update({
            embeds: [generatePageEmbed(page)],
            components: [row]
        });
    });
}
