import { CommendationsComponentResponse } from "./controllers/types/bungieNetApiTypes";
import { 
  CommendationCategoryMap, 
  CommendationSummary, 
  ProfileActivitiesWeight, 
  defaultWeight, 
  CommendationCategory, 
  Commendation } from "./controllers/types/customTypes";

const commendationCategories: CommendationCategoryMap[] = [
    {
        name: "Leadership",
        commendations: [
            { hash: "3872064891", text: "Perceptive", weight: { ...defaultWeight, raidsAndDungeons: true } },
            { hash: "3970150545", text: "Knowledgeable", weight: { ...defaultWeight, raidsAndDungeons: true, endgamePve: true } },
        ],
    },
    {
        name: "Mastery",
        commendations: [
            { hash: "4209356036", text: "Playmaker", weight: { ...defaultWeight, crucible: true } },
            { hash: "363818544", text: "Primeval Instinct", weight: { ...defaultWeight, gambit: true } },
            { hash: "3575743922", text: "Heroic", weight: { ...defaultWeight, raidsAndDungeons: true } },
            { hash: "2205006002", text: "Pacesetter", weight: { ...defaultWeight, trials: true } },
        ],
    },
    {
        name: "Ally",
        commendations: [
            { hash: "2019871317", text: "Indispensable", weight: { ...defaultWeight, endgamePve: true } },
            { hash: "354527503", text: "Selfless", weight: { ...defaultWeight, raidsAndDungeons: true } },
            { hash: "3513056018", text: "Thoughtful", weight: { ...defaultWeight, casualPve: true } },
            { hash: "2506835299", text: "Patient and Considerate", weight: { ...defaultWeight, raidsAndDungeons: true } },
        ],
    },
    {
        name: "Fun",
        commendations: [
            { hash: "3377580220", text: "Joy Bringer", weight: { ...defaultWeight, casualPve: true } },
            { hash: "3037314846", text: "Level-headed", weight: { ...defaultWeight, crucible: true, gambit: true } },
            { hash: "3030493827", text: "Saint's Favorite", weight: { ...defaultWeight, trials: true } },
        ],
    },
];

function getPlayerCommendationsCardInText(summary: CommendationSummary): string {
  let card = `Total score: ${summary.totalScore}\nGiven: ${summary.given}\nReceived: ${summary.received}\n\n`;

  for (const category of summary.categories) {
    card += `${category.name}:\n`;

    for (const commendation of category.commendations) {
      card += `- ${commendation.value} ${commendation.name}\n`;
    }

    card += '\n';
  }

  return card.trim();
}

function mapCommendationsResponse(input: CommendationsComponentResponse): CommendationSummary {
    const data = input.Response.profileCommendations.data;
  
    const activityPoints: ProfileActivitiesWeight = {
      crucible: 0,
      trials: 0,
      gambit: 0,
      casualPve: 0,
      endgamePve: 0,
      raidsAndDungeons: 0
    };
  
    const categories: CommendationCategory[] = commendationCategories.map((category) => {
      const commendations: Commendation[] = category.commendations
        .map((commendation) => {
          const score = data.commendationScoresByHash[commendation.hash];
          if (score > 0) {
            for (const [key, value] of Object.entries(commendation.weight)) {
              if (value) {
                activityPoints[key as keyof ProfileActivitiesWeight] += score;
              }
            }
            return { name: commendation.text, value: score };
          } else {
            return null;
          }
        })
        .filter((commendation) => commendation !== null) as Commendation[];
  
      return { name: category.name, commendations };
    });
  
    const summary: CommendationSummary = {
      totalScore: data.totalScore,
      given: data.scoreDetailValues[0],
      received: data.scoreDetailValues[1],
      categories,
      activityPoints, // Add the activityPoints field to the summary object
    };
  
    return summary;
}
  

export { mapCommendationsResponse, getPlayerCommendationsCardInText };
    