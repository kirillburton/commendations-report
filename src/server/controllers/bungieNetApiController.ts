// src/server/controllers/bungieNetApiController.ts
import {
    ApiResponse,
    PlayerMembership,
    SearchResultsResponse,
    SearchPlayerListItem,
    CommendationsComponentResponse
} from '../../types/bungieNetApiTypes.js';
import { PlayerNamesAndMembership } from '../../types/customTypes.js';
import { getBungieData } from '../transport/apiTransport.js';

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
        const playerMembershipsFoundByBungieName =
            response.Response as PlayerMembership[];
        let playerMemberships: PlayerMembership[] | undefined;
        if (playerMembershipsFoundByBungieName.length === 0) {
            const displayName = bungieName.split(encodeURIComponent('#'))[0];
            const playerProfilesFoundByPrefix =
                await getSearchPlayerResultsListByDisplayName(displayName);

            playerMemberships =
                playerProfilesFoundByPrefix?.[0]?.destinyMemberships ??
                undefined;

            if (!playerMemberships) {
                return null;
            }
        }

        playerMemberships =
            playerMemberships || playerMembershipsFoundByBungieName;

        const mainMembership =
            playerMemberships.find(
                (item: PlayerMembership) =>
                    item.membershipType === item.crossSaveOverride
            ) ||
            playerMemberships.find(
                (item: PlayerMembership) => item.crossSaveOverride === 0
            );

        if (!mainMembership) {
            return null;
        }

        const playerProfile: PlayerNamesAndMembership = {
            membershipType: mainMembership.membershipType,
            membershipId: mainMembership.membershipId,
            bungieGlobalDisplayName: mainMembership.bungieGlobalDisplayName,
            bungieName:
                mainMembership.bungieGlobalDisplayName +
                '#' +
                mainMembership.bungieGlobalDisplayNameCode
        };

        return playerProfile;
    } catch (error) {
        console.error(`Error getting player profile from Bungie API: ${error}`);
        throw new BungieNetApiError(
            `Error getting player profile from Bungie API: ${error}`
        );
    }
}

async function getSearchPlayerResultsListByDisplayName(
    globalDisplayName: string
): Promise<SearchPlayerListItem[] | null> {
    const url = `User/Search/Prefix/${globalDisplayName}/0/`;
    try {
        const response = await getBungieData<ApiResponse>(url);
        const searchPlayersByPrefix =
            response.Response as SearchResultsResponse;
        if (searchPlayersByPrefix.searchResults.length === 0) {
            return null;
        }

        return searchPlayersByPrefix.searchResults;
    } catch (error) {
        console.error(
            `Error searching for player profiles by prefix from Bungie API: ${error}`
        );
        throw new BungieNetApiError(
            `Error searching for player profiles by prefix from Bungie API: ${error}`
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
