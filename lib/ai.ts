import OpenAI from "openai";
import Groq from "groq-sdk";

export function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export function getGroq() {
  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
}
