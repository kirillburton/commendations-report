// src/server/controllers/openAIApiController.ts
// controller for getting generated summary from сhatgpt api
import { generatePrompt } from './utils/promptGenerator.js';
import { createOpenAIChatCompletion } from '../transport/apiTransport.js';

async function getAIPlayerSummary(profileForPrompt: string): Promise<string> {
    try {
        const response = await createOpenAIChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'user', content: generatePrompt(profileForPrompt) }
            ],
            temperature: 0.7,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        });

        return (
            response.choices[0].message?.content ||
            'AI generated summary is not available at this time. '
        );
    } catch (error) {
        return 'AI generated summary is not available at this time. ';
    }
}

export { getAIPlayerSummary };
