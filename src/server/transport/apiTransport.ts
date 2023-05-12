// src/server/transport/apiTransport.ts
import axios from 'axios';
import {
    Configuration,
    CreateChatCompletionRequest,
    OpenAIApi,
    CreateChatCompletionResponse
} from 'openai';

const BUNGIE_API_KEY = process.env.BUNGIE_API_KEY || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const bungieBaseUrl = 'https://www.bungie.net/Platform/';

const bungieAxiosInstance = axios.create({
    baseURL: bungieBaseUrl,
    headers: {
        'X-API-KEY': BUNGIE_API_KEY
    }
});

const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY }));

export async function getBungieData<T>(url: string): Promise<T> {
    try {
        const response = await bungieAxiosInstance.get<T>(bungieBaseUrl + url);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function createOpenAIChatCompletion<
    T extends CreateChatCompletionRequest
>(params: T): Promise<CreateChatCompletionResponse> {
    try {
        const response = await openai.createChatCompletion(params);
        return response.data;
    } catch (error) {
        throw error;
    }
}
