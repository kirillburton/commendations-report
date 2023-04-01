import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import {
  getPlayerNamesAndMembershipByBungieName,
  getCommendationsByMembershipId
} from './controllers/bungieNetApiController.js';
import { getAIPlayerSummary } from './controllers/openAIApiController.js';
import { PlayerNamesAndMembership, Temp } from '../types/customTypes.js';
import { mapCommendationsResponse } from './apiCommendationsComponentMapper.js';
import { getCommendationsSummaryAsTextForPrompt } from './getCommendationsByMembershipId.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = new Koa();
const router = new Router();

const fullpath = path.join(__dirname, '../client');
app.use(serve(fullpath));
console.log(path);
app.use(bodyParser());

router.post('/api/search', async (ctx: any) => {
    const { bungieName } = ctx.request.body;
    const playerNamesAndMemberships = await getPlayerNamesAndMembershipByBungieName(bungieName);

    if (!playerNamesAndMemberships) {
        ctx.status = 404;
        ctx.body = { error: 'Player not found' };
        return;
    }

    const playerNamesAndMembership: PlayerNamesAndMembership = {
        membershipType: playerNamesAndMemberships.membershipType,
        membershipId: playerNamesAndMemberships.membershipId,
        bungieGlobalDisplayName: playerNamesAndMemberships.bungieGlobalDisplayName,
        bungieName: playerNamesAndMemberships.bungieName,
    };
    
    ctx.body = playerNamesAndMembership;
});
  
router.post('/api/commendations', async (ctx: any) => {
    const playerNames : PlayerNamesAndMembership = ctx.request.body;
    const commendations = await getCommendationsByMembershipId(playerNames);
    const summarizedCommendations = mapCommendationsResponse(commendations);
    ctx.body = summarizedCommendations;
});
  
router.post('/api/summary', async (ctx: any) => {
    const data : Temp = ctx.request.body;
    const commendationsText = getCommendationsSummaryAsTextForPrompt(data.playerProfile, data.commendationSummary);
    const summary = await getAIPlayerSummary(commendationsText);
    ctx.body = summary;
});
  
app.use(router.routes()).use(router.allowedMethods());
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
  