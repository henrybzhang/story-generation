import { ChatOpenAI } from "@langchain/openai";

// Initialize LangChain with OpenRouter
/*
const createLangChainClient = () => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set in environment variables");
  }

  if (!process.env.MODEL_NAME) {
    throw new Error("MODEL_NAME is not set in environment variables");
  }

  return new ChatOpenAI({
    model: process.env.MODEL_NAME,
    temperature: 0.8,
    apiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
    },
  });
};
*/

// Initialize LangChain with Grok
const createLangChainClient = () => {
  if (!process.env.GROK_API_KEY) {
    throw new Error("GROK_API_KEY is not set in environment variables");
  }

  return new ChatOpenAI({
    model: "grok-4-fast-reasoning",
    temperature: 0.3,
    apiKey: process.env.GROK_API_KEY,
    configuration: {
      baseURL: "https://api.x.ai/v1",
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
