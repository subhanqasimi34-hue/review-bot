# Discord Review Bot

A professional Discord bot for reviews, vouches, ranking, profiles, and leaderboard — powered by SQLite and Discord Interactions (Webhook-Based).

## ✨ Features
- ⭐ Review system (1–5 stars)
- 📝 Categories (ingame, support, chat, ticket, trade, moderation, report, voice, other)
- 👍 Vouch system (+10 points)
- 🎖 Rank system with badges
- 🏆 Leaderboard (Top 10)
- 📘 Profile with latest reviews
- 💾 SQLite database
- 🚀 Fully compatible with Discloud!

---

## 📁 Project Structure

```
/
├── server.js
├── handler.js
├── config.json
├── package.json
├── deploy-commands.js
├── commands/
│   ├── review.js
│   ├── profile.js
│   ├── leaderboard.js
│   ├── rank.js
│   └── vouch.js
├── commands-json/
│   ├── review.json
│   ├── profile.json
│   ├── leaderboard.json
│   ├── rank.json
│   └── vouch.json
└── utils/
    └── database.js
```

---

## 🔧 Installation (Local)

1. Install dependencies:
```
npm install
```

2. Deploy slash commands:
```
npm run deploy
```

3. Start server:
```
npm start
```

---

## 🚀 Deployment on Render (FREE)

### 1️⃣ Create a new Web Service
- Environment: **Node**
- Build Command: *(leave empty)*
- Start Command:
```
node server.js
```

### 2️⃣ Add Environment Variables

Go to Render → Environment → Add Environment Variables:

| Name | Value |
|------|--------|
| DISCORD_TOKEN | your bot token |
| PUBLIC_KEY | your app public key |
| CLIENT_ID | your bot client ID |

⚠️ Do NOT put real tokens in config.json — leave the placeholders.

---

## 📡 Webhook URL for Discord
Once Render deploys, copy your service URL:

```
https://your-app.onrender.com/interactions
```

Add this URL under:

**Discord Developer Portal → Interactions Endpoint URL**

---

## ✔ Final Step
Redeploy service → your bot is online!

---


## Made by Red_thz Discord!!
