// src/server/controllers/openAIApiController.ts
// controller for getting generated summary from сhatgpt api
import { Configuration, OpenAIApi } from "openai";
import { generatePrompt } from "./utils/promptGenerator.js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

function createOpenAIClient() {
    const configuration = new Configuration({
        apiKey: OPENAI_API_KEY,
    });
    return new OpenAIApi(configuration);
}

const openai = createOpenAIClient();

async function getAIPlayerSummary(profileForPrompt: string): Promise<string> {
    try {
        // chatgpt 0.002$ for 1K tokens
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: generatePrompt(profileForPrompt) }],
            temperature: 0.7,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        // da vinci 0.02$ for 1K tokes
        /*const response = await openai.createCompletion({
            model: "davinci-text-003",
            prompt: generatePrompt(profileForPrompt),
            temperature: 0.7,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });*/
        return response.data.choices[0].message?.content || "AI generated summary is not available at this time. ";
    } catch (error) {
        return "AI generated summary is not available at this time. ";
    }
}

export { getAIPlayerSummary };