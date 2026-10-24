exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  const reply = (statusCode, body) => ({
    statusCode,
    headers,
    body: JSON.stringify(body)
  });

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return reply(405, { error: "Method not allowed." });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return reply(500, { error: "Telegram notification is not configured yet." });
  }

  let payload;

  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return reply(400, { error: "Invalid request body." });
  }

  if (payload.consent !== true || !payload.data || typeof payload.data !== "object") {
    return reply(400, { error: "Valid data and consent are required." });
  }

  const clean = (value, max = 1000) =>
    String(value == null ? "" : value)
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
      .slice(0, max)
      .trim();

  let message = "";

  if (payload.type === "creator_application") {
    const d = payload.data;

    message = [
      "MISS AFFILIATE — NEW CREATOR APPLICATION",
      "Reference: " + clean(d.reference, 80),
      "Name: " + clean(d.name, 150),
      "Creator handle: " + clean(d.handle, 150),
      "Email: " + clean(d.email, 200),
      "Social profile: " + clean(d.profile, 300),
      "Follower range: " + clean(d.followers, 100),
      "Niche: " + clean(d.niche, 150),
      "Help needed: " + clean(d.gap, 500),
      "Goals / questions: " + clean(d.goals, 1500)
    ].join("\n");

  } else if (payload.type === "support_request") {
    const d = payload.data;

    message = [
      "MISS AFFILIATE — NEW SUPPORT REQUEST",
      "Name: " + clean(d.name, 150),
      "Email: " + clean(d.email, 200),
      "Request type: " + clean(d.requestType, 150),
      "Message: " + clean(d.message, 2000)
    ].join("\n");

  } else {
    return reply(400, { error: "Unknown request type." });
  }

  try {
    const telegramResponse = await fetch(
      "https://api.telegram.org/bot" + botToken + "/sendMessage",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          disable_web_page_preview: true
        })
      }
    );

    const result = await telegramResponse.json().catch(() => ({}));

    if (!telegramResponse.ok || result.ok !== true) {
      return reply(502, {
        error: "Telegram could not deliver the notification. Check the bot setup."
      });
    }

    return reply(200, { ok: true });

  } catch {
    return reply(502, {
      error: "Could not reach Telegram. Please try again later."
    });
  }
};
