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
): Promise<PlayerNamesAndMembership[] | PlayerNamesAndMembership | null> {
    const encodedBungieName = encodeURIComponent(bungieName);
    const url = `Destiny2/SearchDestinyPlayer/-1/${encodedBungieName}/`;
    try {
        const response = await getBungieData<ApiResponse>(url);
        const playerMembershipsFoundByBungieName =
            response.Response as PlayerMembership[];
        let playerMemberships: PlayerMembership[][] = [];
        let playerProfilesFoundByPrefix: SearchPlayerListItem[] | null;
        if (playerMembershipsFoundByBungieName.length === 0) {
            const displayName = bungieName.split(encodeURIComponent('#'))[0];
            playerProfilesFoundByPrefix =
                await getSearchPlayerResultsListByDisplayName(displayName);

            if (!playerProfilesFoundByPrefix) {
                return null;
            }

            for (const player of playerProfilesFoundByPrefix) {
                playerMemberships?.push(player.destinyMemberships);
            }
        }

        const players =
            getPlayerNamesAndMembershipsFromApiMembershipEntities(
                playerMemberships
            );
        return players?.length === 1 ? players[0] : players;
    } catch (error) {
        console.error(`Error getting player profile from Bungie API: ${error}`);
        throw new BungieNetApiError(
            `Error getting player profile from Bungie API: ${error}`
        );
    }
}

function getPlayerNamesAndMembershipsFromApiMembershipEntities(
    memberships: PlayerMembership[][]
): PlayerNamesAndMembership[] | null {
    const playerNamesAndMemberships: PlayerNamesAndMembership[] = [];
    for (const player of memberships) {
        const mainMembership =
            player.find(
                (item: PlayerMembership) =>
                    item.membershipType === item.crossSaveOverride
            ) ||
            player.find(
                (item: PlayerMembership) => item.crossSaveOverride === 0
            );

        if (!mainMembership) {
            continue;
        }

        const playerProfile: PlayerNamesAndMembership = {
            membershipType: mainMembership.membershipType,
            membershipId: mainMembership.membershipId,
            bungieGlobalDisplayName: mainMembership.bungieGlobalDisplayName,
            bungieName:
                mainMembership.bungieGlobalDisplayName.toLowerCase() +
                '#' +
                mainMembership.bungieGlobalDisplayNameCode
        };
        playerNamesAndMemberships.push(playerProfile);
    }

    return playerNamesAndMemberships;
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
