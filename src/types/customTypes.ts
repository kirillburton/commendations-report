// src/server/types/bungieNetApiTypes.ts

export type PlayerNamesAndMembership = {
    membershipType: number;
    membershipId: string;
    bungieGlobalDisplayName: string;
    bungieName: string;
};

export type PlayerProfile = {
    bungieName: string;
    displayName: string;
    commendationSummary: CommendationSummary;
    chatGPTSummary: string;
};

export interface Commendation {
    name: string;
    value: number;
}

export interface CommendationCategory {
    name: string;
    commendations: Commendation[];
}

export type CommendationCategoryMap = {
    name: string;
    commendations: {
        hash: string;
        text: string;
        weight: ActivitiesWeight;
    }[];
};

export interface CommendationSummary {
    totalScore: number;
    given: number;
    received: number;
    categories: CommendationCategory[];
    activityPoints: ProfileActivitiesWeight;
}

export type ActivitiesWeight = {
    crucible: boolean;
    trials: boolean;
    gambit: boolean;
    casualPve: boolean;
    endgamePve: boolean;
    raidsAndDungeons: boolean;
};

export const defaultWeight = {
    crucible: false,
    trials: false,
    gambit: false,
    casualPve: false,
    endgamePve: false,
    raidsAndDungeons: false
};

export type ProfileActivitiesWeight = {
    crucible: number;
    trials: number;
    gambit: number;
    casualPve: number;
    endgamePve: number;
    raidsAndDungeons: number;
};

export type PlayerDataForChatGPT = {
    name: string;
    commendationSummary: CommendationSummary;
};
