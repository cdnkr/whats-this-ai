const { retrieveWhatsAppMediaData } = require("../../api/whatsapp");
const getDescriptionOfQuery = require("../../services/langchain/get-description-of-query");
const getImageIdentification = require("../../services/serp/get-image-identification");
const { uploadImageToCloudinary } = require("../../api/cloudinary");

async function processMessage(message, metadata) {
    let next_response = "";

    if (message.image) {
        const mediaData = await retrieveWhatsAppMediaData(message.image.id);
        const imageUrl = await uploadImageToCloudinary(mediaData);
        const result = await getImageIdentification(imageUrl);

        if (typeof result === "string") {
            next_response = await getDescriptionOfQuery(result);
        }
    } else {
        next_response = message.text ? message.text.body : "Failed to retrieve info";
    }

    return {
        to: message.from,
        content: next_response || "Failed to retrieve info about your image",
        phone_number_id: metadata.phone_number_id,
        type: next_response && typeof next_response === "object" ? "interactive" : "text"
    };
}

module.exports = processMessage;