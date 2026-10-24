MISS AFFILIATE — TELEGRAM NOTIFICATIONS

What this package does
- Keeps your existing index.html.
- Adds the Netlify Function your website already calls: /.netlify/functions/telegram-notify
- Sends creator applications and support requests to the Telegram chat ID configured in Netlify.

IMPORTANT: A plain Netlify Drop upload is for static files and may not deploy serverless functions.
Deploy this project using a Git-connected Netlify site or Netlify CLI so the function is deployed too.

SETUP
1. In Telegram, open your bot and send /start from the Telegram account that should receive notifications.
2. Obtain the bot token from the official BotFather chat. Never share it publicly or put it in index.html.
3. Obtain the numeric chat ID for the receiving Telegram account. The bot must have permission to message that account (usually by the account starting the bot first).
4. Deploy this whole folder as the site root, preserving:
   - index.html
   - netlify.toml
   - netlify/functions/telegram-notify.js
5. In Netlify, open the site dashboard, then Site configuration (or Project configuration) > Environment variables.
   Add:
   TELEGRAM_BOT_TOKEN = your bot token
   TELEGRAM_CHAT_ID = your numeric personal chat ID
   Keep both values private.
6. Trigger a new deploy after adding the variables.
7. Test the application form and support form. Only submit real personal information with the person's consent.

SECURITY NOTES
- Never paste your bot token into this chat or into public HTML/JavaScript.
- Do not publish the token in a GitHub repository.
- If the token has ever been exposed publicly, revoke it with BotFather and create a new one.
