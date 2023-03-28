type ApiCommendationsComponentResponse = {
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

type CommendationCategory = {
    name: string;
    commendations: {
        hash: string;
        text: string;
    }[];
};

const commendationCategories: CommendationCategory[] = [
    {
        name: "Leadership",
        commendations: [
            { hash: "3872064891", text: "Perceptive" },
            { hash: "3970150545", text: "Knowledgeable" },
        ],
    },
    {
        name: "Mastery",
        commendations: [
            { hash: "4209356036", text: "Playmaker" },
            { hash: "363818544", text: "Primeval Instinct" },
            { hash: "3575743922", text: "Heroic" },
            { hash: "2205006002", text: "Pacesetter" },
        ],
    },
    {
        name: "Ally",
        commendations: [
            { hash: "2019871317", text: "Indispensable" },
            { hash: "354527503", text: "Selfless" },
            { hash: "3513056018", text: "Thoughtful" },
            { hash: "2506835299", text: "Patient and Considerate" },
        ],
    },
    {
        name: "Fun",
        commendations: [
            { hash: "3377580220", text: "Joy Bringer" },
            { hash: "3037314846", text: "Level-headed" },
            { hash: "3030493827", text: "Saint's Favorite" },
        ],
    },
];

function mapCommendationsResponse(input: ApiCommendationsComponentResponse): string {
    const data = input.Response.profileCommendations.data;

    let summary = `Total score: ${data.totalScore}\nGiven: ${data.scoreDetailValues[0]}\nReceived: ${data.scoreDetailValues[1]}\n\n`;

    for (const category of commendationCategories) {
        summary += `${category.name}:\n`;

        for (const commendation of category.commendations) {
            const score = data.commendationScoresByHash[commendation.hash];
            if (score > 0) {
                summary += `- ${score} ${commendation.text}\n`;
            }
        }

        summary += '\n';
    }

    return summary.trim();
}

export { mapCommendationsResponse, ApiCommendationsComponentResponse };
    