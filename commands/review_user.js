
import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } from "discord.js";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./database/reviews.sqlite");

db.run("CREATE TABLE IF NOT EXISTS reviews (reviewer TEXT, helper TEXT, rating INTEGER, category TEXT, comment TEXT)");

export const data=new SlashCommandBuilder()
  .setName("review_user")
  .setDescription("Submit a review for a helper.");

export async function execute(interaction){
  const modal=new ModalBuilder().setCustomId("reviewModal").setTitle("Submit Review");

  const helper=new TextInputBuilder().setCustomId("helper").setLabel("Helper (mention or ID)").setRequired(true).setStyle(TextInputStyle.Short);
  const rating=new TextInputBuilder().setCustomId("rating").setLabel("Rating (1-5)").setRequired(true).setStyle(TextInputStyle.Short);
  const category=new TextInputBuilder().setCustomId("category").setLabel("Category (ingame/ticket/chat/voice)").setRequired(true).setStyle(TextInputStyle.Short);
  const comment=new TextInputBuilder().setCustomId("comment").setLabel("Comment").setRequired(true).setStyle(TextInputStyle.Paragraph);

  modal.addComponents(
    new ActionRowBuilder().addComponents(helper),
    new ActionRowBuilder().addComponents(rating),
    new ActionRowBuilder().addComponents(category),
    new ActionRowBuilder().addComponents(comment)
  );

  await interaction.showModal(modal);
}

export async function handleModal(interaction){
  if(interaction.customId!=="reviewModal")return;

  const helper=interaction.fields.getTextInputValue("helper");
  const rating=parseInt(interaction.fields.getTextInputValue("rating"));
  const category=interaction.fields.getTextInputValue("category").toLowerCase();
  const comment=interaction.fields.getTextInputValue("comment");

  if(isNaN(rating)||rating<1||rating>5)
    return interaction.reply({content:"Rating must be 1-5.",ephemeral:true});

  const valid=["ingame","ticket","chat","voice"];
  if(!valid.includes(category))
    return interaction.reply({content:"Invalid category.",ephemeral:true});

  db.run("INSERT INTO reviews VALUES(?,?,?,?,?)",
    [interaction.user.id, helper, rating, category, comment]);

  const stars="⭐".repeat(rating)+"☆".repeat(5-rating);

  const emb=new EmbedBuilder()
    .setTitle("⭐ New Review Submitted")
    .setColor(0xFFD700)
    .addFields(
      {name:"Reviewer",value:`<@${interaction.user.id}>`},
      {name:"Helper",value:helper},
      {name:"Rating",value:stars},
      {name:"Category",value:category},
      {name:"Comment",value:comment}
    );

  await interaction.reply({embeds:[emb]});
}
