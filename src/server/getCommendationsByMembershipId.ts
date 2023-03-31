import { CommendationSummary, PlayerNamesAndMembership } from "./controllers/types/customTypes";

export function getCommendationsSummaryAsTextForPrompt(playerProfile: PlayerNamesAndMembership, commendationsSummary: CommendationSummary): string {
  return `${playerProfile.bungieGlobalDisplayName} (${playerProfile.bungieName})\n${JSON.stringify(commendationsSummary)}`;
}

