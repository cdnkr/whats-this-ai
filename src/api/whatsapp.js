const axios = require("axios").default;

const token = process.env.WHATSAPP_TOKEN;
const whatsappApiUrl = process.env.WA_API_URL;

async function sendWhatsAppMessage(to, response, phoneNumberId, messageType, isTestMode) {
  const messagePayload = {
    messaging_product: "whatsapp",
    to,
    type: messageType,
    [messageType]: messageType === "text" ? { body: response } : response,
  };

  if (isTestMode) {
    return messagePayload;
  }

  try {
    const requestUrl = `${whatsappApiUrl}${phoneNumberId}/messages?access_token=${token}`;

    await axios.post(requestUrl, messagePayload, { headers: { "Content-Type": "application/json" } });

    return true;
  } catch (err) {
    console.error("Error in sendWhatsAppMessage: ", err.message);
    return false;
  }
}

async function retrieveWhatsAppMediaData(mediaId) {
  try {
    const mediaDetailsResponse = await axios.get(`${whatsappApiUrl}${mediaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const imageDataResponse = await axios.get(mediaDetailsResponse.data.url, {
      responseType: "arraybuffer",
      headers: { Authorization: `Bearer ${token}` },
    });

    return imageDataResponse.data;
  } catch (err) {
    console.error("Error in retrieveWhatsAppMediaData:", err.message);
    return false;
  }
}

module.exports = { sendWhatsAppMessage, retrieveWhatsAppMediaData };
