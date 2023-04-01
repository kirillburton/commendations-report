import { CommendationSummary, PlayerNamesAndMembership } from "../types/customTypes.js";

export function getCommendationsSummaryAsTextForPrompt(playerProfile: PlayerNamesAndMembership, commendationsSummary: CommendationSummary): string {
  return `${playerProfile.bungieGlobalDisplayName} (${playerProfile.bungieName})\n${JSON.stringify(commendationsSummary)}`;
}

