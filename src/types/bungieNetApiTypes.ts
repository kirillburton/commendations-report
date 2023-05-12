// src/server/types/bungieNetApiTypes.ts

export type PlayerMembership = {
    iconPath: string;
    crossSaveOverride: number;
    applicableMembershipTypes: number[];
    isPublic: boolean;
    membershipType: number;
    membershipId: string;
    displayName: string;
    bungieGlobalDisplayName: string;
    bungieGlobalDisplayNameCode: number;
};

export type SearchResultsResponse = {
    searchResults: SearchPlayerListItem[];
    page: number;
    hasMore: boolean;
};

export type SearchPlayerListItem = {
    bungieGlobalDisplayName: string;
    bungieGlobalDisplayNameCode: number;
    bungieNetMembershipId: number;
    destinyMemberships: PlayerMembership[];
};

export type ApiResponse = {
    Response: PlayerMembership[] | SearchResultsResponse;
    ErrorCode: number;
    ThrottleSeconds: number;
    ErrorStatus: string;
    Message: string;
    MessageData: Record<string, unknown>;
};

export type CommendationsComponentResponse = {
    Response: {
        profileCommendations: {
            data: {
                totalScore: number;
                commendationNodePercentagesByHash: Record<string, number>;
                scoreDetailValues: [number, number];
                commendationScoresByHash: Record<string, number>;
            };
            privacy: number;
        };
    };
};
