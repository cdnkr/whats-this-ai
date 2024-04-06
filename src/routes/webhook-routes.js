const express = require("express");

const router = express.Router();

const {
    handleWebhookPost,
    handleWebhookVerification
} = require("../webhooks/whatsapp");

router.post("/", handleWebhookPost);

router.get("/", handleWebhookVerification);

module.exports = router;