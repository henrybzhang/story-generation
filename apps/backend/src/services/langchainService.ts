import { ChatOpenAI } from "@langchain/openai";

// Initialize LangChain with OpenRouter
const createLangChainClient = () => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set in environment variables");
  }

  return new ChatOpenAI({
    model: "x-ai/grok-4-fast",
    temperature: 0.8,
    apiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
    },
  });
};

// Initialize LangSmith if API key is provided
const initializeLangSmith = () => {
  if (process.env.LANGCHAIN_API_KEY) {
    process.env.LANGCHAIN_TRACING_V2 = "true";
    process.env.LANGCHAIN_PROJECT =
      process.env.LANGCHAIN_PROJECT || "story-generation";
    process.env.LANGCHAIN_ENDPOINT = "https://api.smith.langchain.com";
  }
};

// Initialize LangSmith when this module is imported
initializeLangSmith();

export { createLangChainClient };
