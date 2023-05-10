// src/server/controllers/bungieNetApiController.ts
import {
    ApiResponse,
    SearchPlayerResponse,
    CommendationsComponentResponse
} from '../../types/bungieNetApiTypes.js';
import { PlayerNamesAndMembership } from '../../types/customTypes.js';
import { getBungieData } from '../transport/apiTransport';

class BungieNetApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BungieNetApiError';
    }
}

async function getPlayerNamesAndMembershipByBungieName(
    bungieName: string
): Promise<PlayerNamesAndMembership | null> {
    const encodedBungieName = encodeURIComponent(bungieName);
    const url = `Destiny2/SearchDestinyPlayer/-1/${encodedBungieName}/`;
    try {
        const response = await getBungieData<ApiResponse>(url);
        if (response.Response.length === 0) {
            return null;
        }

        const foundItem = response.Response.find(
            (item: SearchPlayerResponse) =>
                item.membershipType === item.crossSaveOverride
        );

        if (!foundItem) {
            return null;
        }

        const playerProfile: PlayerNamesAndMembership = {
            membershipType: foundItem.membershipType,
            membershipId: foundItem.membershipId,
            bungieGlobalDisplayName: foundItem.bungieGlobalDisplayName,
            bungieName: bungieName
        };

        return playerProfile;
    } catch (error) {
        console.error(`Error getting player profile from Bungie API: ${error}`);
        throw new BungieNetApiError(
            `Error getting player profile from Bungie API: ${error}`
        );
    }
}

async function getCommendationsByMembershipId(
    playerProfile: PlayerNamesAndMembership
): Promise<CommendationsComponentResponse> {
    const { membershipType, membershipId } = playerProfile;
    const commendationComponentNumber = 1400;
    const url = `Destiny2/${membershipType}/Profile/${membershipId}/?components=${commendationComponentNumber}`;
    try {
        const response = await getBungieData<CommendationsComponentResponse>(
            url
        );
        return response;
    } catch (error) {
        console.error(`Error getting commendations from Bungie API: ${error}`);
        throw new BungieNetApiError(
            `Error getting commendations from Bungie API: ${error}`
        );
    }
}

export {
    getPlayerNamesAndMembershipByBungieName,
    getCommendationsByMembershipId
};
