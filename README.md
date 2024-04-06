# What's This AI

**What's This AI** is a Node.js application that leverages the power of various APIs including Facebook's WhatsApp, OpenAI, SERP API, and Cloudinary, to provide users with detailed information about objects in images sent through WhatsApp. By integrating advanced technologies, this app identifies products, items, or things in images and enriches users' knowledge about them with descriptions, and potentially, reviews and purchasing options in the future.

## Features

- **Image Identification:** Users send an image via WhatsApp, and the app identifies the object using SERP Google Lens reverse image search for precise product names.
- **Rich Descriptions:** Utilizes a combination of SERP and OpenAI API to generate detailed descriptions of the identified objects.
- **Easy Integration:** Set up with Facebook App connected to WhatsApp and Webhooks.
- **Cloud Support:** Utilizes Cloudinary for efficient image handling and URL generation.

## Prerequisites

Before setting up the project, ensure you have the following:

- A Facebook App set up with WhatsApp and Webhooks products.
- An OpenAI API key.
- A SERP API key.
- A Cloudinary API key.

## Getting Started

### Step 1: Clone the Repository

Clone this repository to your local machine to get started with the setup.

```bash
git clone <repository-url>
```

### Step 2: Install Dependencies

Navigate into the project directory and install the required Node.js dependencies.

```bash
cd whats-this-ai
npm install
```

### Step 3: Environment Setup

Create a `.env` file in the root of the project and populate it with your API keys and Facebook App credentials.

```
OPENAI_API_KEY=<your_openai_api_key>
SERP_API_KEY=<your_serp_api_key>
CLOUDINARY_URL=<your_cloudinary_url>
WHATSAPP_TOKEN=<your_whatsapp_token>
```

### Step 4: Configure Facebook App

Follow the instructions on [Meta for Developers](https://developers.facebook.com/) to add WhatsApp and Webhooks to your Facebook App. Ensure your Node.js application's webhook is correctly set up to receive messages from WhatsApp.

### Step 5: Run the Application

Start the server with the following command:

```bash
npm start
```

Your application is now running and ready to receive image messages through WhatsApp.

## How It Works

1. **Receive an Image:** The application receives an image sent to the WhatsApp number via a webhook.
2. **Upload to Cloudinary:** The image, received as byte data, is uploaded to Cloudinary to get a URL.
3. **SERP Google Lens Search:** The URL is sent to Google Lens through SERP API to identify the object in the image.
4. **Generate Description:** With the most frequent phrase identified, a detailed description is generated using SERP/OpenAI chain.
5. **Respond to User:** The description is sent back to the user via WhatsApp's Graph API.

## Future Goals

- Provide comprehensive reviews, purchasing options, and information on similar or competing products.
- Enhance the ability to handle generic questions related to the identified product.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Advanced Object Detection (Future Consideration)

In addition to the current image identification and description functionalities, **What's This AI** was designed with the potential to incorporate advanced object detection capabilities. This enhancement aims to further refine the accuracy of product identification through a two-step process:

1. **Object Detection and Cropping:** Upon receiving an image, the application would employ object detection algorithms to identify and locate objects within the image. By analyzing the image, it could determine the bounding boxes of detected objects and crop the image to focus on the largest object. This process is intended to isolate the primary subject of the image, minimizing background noise and irrelevant content.

2. **Enhanced Product Identification:** The cropped image would then be utilized in the Google Lens reverse image search through the SERP API. The hypothesis is that a focused image of the product would yield more accurate and relevant search results, enhancing the identification process.

### Current Status and Considerations

This object detection and cropping feature is not currently implemented in the application. Preliminary tests have shown that the effectiveness of this approach can vary significantly depending on the complexity of the image, the objects present, and their spatial arrangements. In some cases, cropping to the largest object's bounding box has led to improved product identification accuracy. However, in other scenarios, it may exclude relevant objects or parts of the image that are necessary for accurate identification.