import 'dotenv/config' 
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import {
  getPlayerNamesAndMembershipByBungieName,
  getCommendationsByMembershipId
} from './controllers/bungieNetApiController.js';
import { getAIPlayerSummary } from './controllers/openAIApiController.js';
import { PlayerNamesAndMembership, PlayerDataForChatGPT } from '../types/customTypes.js';
import { mapCommendationsResponse } from './apiCommendationsComponentMapper.js';

const app = new Koa();
// Error handling
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err: any) {
        ctx.status = err.status || 500;
        ctx.body = { 
            error: {
                code: ctx.status,
                message: err.message 
            }
        }
        ctx.app.emit('error', err, ctx);
    }
});

const router = new Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fullpath = join(__dirname, '../client');


app.use(serve(fullpath));
app.use(bodyParser());


router.get('/api/search/', async (ctx: any) => {
    const bungieName = ctx.request.query.bungieName;
    //const { bungieName } = ctx.request.body;
    console.log(bungieName);
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
    const profile : PlayerDataForChatGPT = ctx.request.body;

    const name = profile.name; 
    const commendations = profile.commendationSummary;
    const profileForPrompt = `${name}\n${JSON.stringify(commendations)}`;
    console.log(`Text for prompt is: ${profileForPrompt}`);

    const summary = await getAIPlayerSummary(profileForPrompt);
    ctx.body = summary;
});
  
app.use(router.routes()).use(router.allowedMethods());
  
const PORT = parseInt(process.env.PORT || "3000");
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
})

  