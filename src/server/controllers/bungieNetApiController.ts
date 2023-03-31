// src/server/controllers/bungieNetApiController.ts
import axios from "axios";
import { ApiResponse, SearchPlayerResponse, CommendationsComponentResponse } from "./types/bungieNetApiTypes";
import { PlayerNamesAndMembership } from './types/customTypes';

const BUNGIE_API_KEY = process.env.BUNGIE_API_KEY || "";
const baseUrl = "https://www.bungie.net/Platform";

class BungieNetApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BungieNetApiError";
  }
}

async function getPlayerNamesAndMembershipByBungieName(bungieName: string): Promise<PlayerNamesAndMembership | null> {
    const encodedBungieName = encodeURIComponent(bungieName);
    const url = `${baseUrl}/Destiny2/SearchDestinyPlayer/-1/${encodedBungieName}/`;
    try {
            console.log(`Getting response for: GET ${url} \nAPI KEY IS: ${BUNGIE_API_KEY}`)
            const response = await axios.get<ApiResponse>(url, {
                    headers: {
                    "X-API-KEY": BUNGIE_API_KEY,
                },
            });

            if (response.data.Response.length === 0) {
                return null;
            }

            const foundItem = response.data.Response.find(
                (item: SearchPlayerResponse) => item.membershipType === item.crossSaveOverride
            );
        
            if (!foundItem) {
                return null;
            }
        
            const playerProfile: PlayerNamesAndMembership = {
                membershipType: foundItem.membershipType,
                membershipId: foundItem.membershipId,
                bungieGlobalDisplayName: foundItem.bungieGlobalDisplayName,
                bungieName: bungieName,
            };
        
            return playerProfile;
        } catch (error) {
            console.error(`Error getting player profile from Bungie API: ${error}`);
            throw new BungieNetApiError(`Error getting player profile from Bungie API: ${error}`);
        }
}
  
async function getCommendationsByMembershipId(playerProfile: PlayerNamesAndMembership): Promise<CommendationsComponentResponse> {
    const { membershipType, membershipId, bungieGlobalDisplayName, bungieName } = playerProfile;
    const commendationComponentNumber = 1400;
    const url = `${baseUrl}/Destiny2/${membershipType}/Profile/${membershipId}/?components=${commendationComponentNumber}`;
  
    try {
        const response = await axios.get<CommendationsComponentResponse>(url, {
            headers: {
              "X-API-KEY": BUNGIE_API_KEY,
            },
          });
          return response.data;
        } catch (error) {
          console.error(`Error getting commendations from Bungie API: ${error}`);
          throw new BungieNetApiError(`Error getting commendations from Bungie API: ${error}`);
        }
}
      
export { getPlayerNamesAndMembershipByBungieName, getCommendationsByMembershipId };
      