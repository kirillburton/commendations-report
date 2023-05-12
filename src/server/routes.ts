import Router from 'koa-router';
import {
    getPlayerNamesAndMembershipByBungieName,
    getCommendationsByMembershipId
} from './controllers/bungieNetApiController.js';
import { getAIPlayerSummary } from './controllers/openAIApiController.js';
import {
    PlayerNamesAndMembership,
    PlayerDataForChatGPT
} from '../types/customTypes.js';
import { mapCommendationsResponse } from './apiCommendationsComponentMapper.js';

const router = new Router();

router.get('/api/search/', async (ctx: any) => {
    console.log('/api/search/ is being used'); //debug
    const bungieName = ctx.request.query.bungieName;
    console.log(
        `Trying to fetch player memberships by bungieName: ${bungieName}`
    );
    const playerNamesAndMemberships =
        await getPlayerNamesAndMembershipByBungieName(bungieName);

    if (!playerNamesAndMemberships) {
        ctx.status = 404;
        ctx.body = { error: 'Player not found' };
        return;
    }

    ctx.body = playerNamesAndMemberships;
});

router.post('/api/commendations', async (ctx: any) => {
    console.log('/api/commendations is being used'); //debug
    const playerNames: PlayerNamesAndMembership = ctx.request.body;
    const commendations = await getCommendationsByMembershipId(playerNames);
    const summarizedCommendations = mapCommendationsResponse(commendations);
    ctx.body = summarizedCommendations;
});

router.post('/api/summary', async (ctx: any) => {
    console.log('/api/summary is being used'); //debug
    const profile: PlayerDataForChatGPT = ctx.request.body;

    const name = profile.name;
    const commendations = profile.commendationSummary;
    const profileForPrompt = `${name}\n${JSON.stringify(commendations)}`;
    console.log(`Text for prompt is: ${profileForPrompt}`); //debug

    const summary = await getAIPlayerSummary(profileForPrompt);
    ctx.body = summary;
});

export { router };
