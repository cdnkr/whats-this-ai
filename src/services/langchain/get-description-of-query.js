const { ChatOpenAI, OpenAIEmbeddings } = require("@langchain/openai");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { SerpAPILoader } = require("langchain/document_loaders/web/serpapi");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { createDocumentsChain, createRetrievalChain } = require("langchain/chains");

// Environment variables for API keys and configurations
const apiKey = process.env.SERP_API_KEY;

// Initialize components outside the function if they don't depend on the query
const llm = new ChatOpenAI();
const embeddings = new OpenAIEmbeddings();

async function getDescriptionOfQuery(query) {
    try {
        // Load documents using the SerpAPILoader
        const loader = new SerpAPILoader({ q: query, apiKey });
        const docs = await loader.load();

        // Validate that documents were successfully retrieved
        if (!docs || docs.length === 0) {
            throw new Error(`No documents found for query: ${query}`);
        }

        // Create a MemoryVectorStore from the documents
        const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

        // Prepare the prompt for document combination
        const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
            ["system", "Answer the user's questions based on the below context:\n\n{context}"],
            ["human", "{input}"],
        ]);

        // Set up chains for document combination and retrieval
        const combineDocsChain = createDocumentsChain({ llm, prompt: questionAnsweringPrompt });
        const chain = createRetrievalChain({ retriever: vectorStore.asRetriever(), combineDocsChain });

        // Invoke the chain to process the input
        const res = await chain.invoke({
            input: `Can you give a brief description of what this is: ${query}`,
        });

        // Return the answer or a fallback message
        return res?.answer ?? `Unable to retrieve information from the web related to ${query}`;
    } catch (error) {
        console.error(`Error in getDescriptionOfQuery: ${error.message}`);
        return `An error occurred while processing your request for ${query}.`;
    }
}

module.exports = getDescriptionOfQuery;
