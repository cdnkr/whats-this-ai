const { sendWhatsAppMessage } = require("../../api/whatsapp");
const processMessage = require("./process-message")

let receivedMessages = [];

async function handleWebhookPost(req, res) {
    try {
        const body = req.body;
        console.log("REQ BODY", body);

        if (!body.object) {
            return res.sendStatus(404);
        }

        const entry = body.entry?.[0];
        const change = entry?.changes?.[0];
        const message = change?.value?.messages?.[0];

        if (message) {
            const messageId = message.id;
            if (receivedMessages.includes(messageId)) {
                return res.sendStatus(200);
            }

            receivedMessages.push(messageId);

            const response = await processMessage(message, entry.changes[0].value.metadata);
            await sendWhatsAppMessage(response.to, response.content, response.phone_number_id, response.type);

            res.sendStatus(200);
        } else {
            res.sendStatus(200);
        }
    } catch (err) {
        console.log("WEBHOOK ERR", err);
        res.sendStatus(400);
    }
}

function handleWebhookVerification(req, res) {
    try {
        const verifyToken = process.env.VERIFY_TOKEN;
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        if (mode === "subscribe" && token === verifyToken) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    } catch (err) {
        console.log("WEBHOOK_VERIFY ERR", err);
    }
}

module.exports = {
    handleWebhookPost,
    handleWebhookVerification
}