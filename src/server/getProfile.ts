// main.ts
import dotenv from 'dotenv';
dotenv.config();

import { getCommendationsSummaryAsTextForPrompt } from './getCommendationsByMembershipId.js';
import { getCommendationsByMembershipId, getPlayerNamesAndMembershipByBungieName} from './controllers/bungieNetApiController.js'
import { getAIPlayerSummary } from './controllers/openAIApiController.js';
import { PlayerProfile } from '../types/customTypes.js';
import { mapCommendationsResponse } from './apiCommendationsComponentMapper.js';

console.log(`BUNGIE API KEY IS: ${process.env.BUNGIE_API_KEY}`);
//npm run getProfile -- "Errorick#4513"
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Please provide a Bungie name as a command-line argument.');
    process.exit(1);
  }

  const bungieName = args[0];
  const namesAndMembership = await getPlayerNamesAndMembershipByBungieName(bungieName);

  if (namesAndMembership) {
    try {
      const rawCommendations = await getCommendationsByMembershipId(namesAndMembership);
      const summarizedCommendations = mapCommendationsResponse(rawCommendations);
      const commendationsText = getCommendationsSummaryAsTextForPrompt(namesAndMembership, summarizedCommendations);
      const summary = await getAIPlayerSummary(commendationsText);

      const playerProfile: PlayerProfile = { 
        bungieName: namesAndMembership.bungieName,
        displayName: namesAndMembership.bungieGlobalDisplayName,
        commendationSummary: summarizedCommendations,
        chatGPTSummary: summary
      }

      console.log(playerProfile);
    } catch (error) {
      console.error(`Error fetching commendations: ${error}`);
    }
  } else {
    console.log('Player profile not found.');
  }
}

async function something() {
    console.time('Execution Time');
    await main();
    console.timeEnd('Execution Time');
}

something();