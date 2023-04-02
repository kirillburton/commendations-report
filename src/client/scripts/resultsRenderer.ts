// This file will be responsible for rendering the results page and managing the loading animations.
// todo: create functions to show and hide loading animations 
// while data is being fetched. 
// Use these functions in conjunction with the data received from the APIs to update the resultsPage.html content.

// Pass initialData from the resultsPage.html
import { CommendationSummary, PlayerNamesAndMembership, PlayerDataForChatGPT } from "../../types/customTypes";
import { renderCommendationsAndActivities } from "./commendationsAndActivitiesRender";

const urlParams = new URLSearchParams(window.location.search);
const initialDataString = urlParams.get('playerNamesAndMembership') || "";
const initialData = JSON.parse(decodeURIComponent(initialDataString)) as PlayerNamesAndMembership;

function setLoading(elementId: string, loading: boolean) {
  const element = document.getElementById(elementId)!;
  if (loading) {
    element.classList.add('loading');
  } else {
    element.classList.remove('loading');
  }
}

function renderNamesContainer(data: {bungieGlobalDisplayName: string, bungieName: string}) {
  const displayName = document.getElementById('#display-name');
  const bungieName = document.getElementById('#bungie-name');
  displayName!.textContent = data.bungieGlobalDisplayName;
  bungieName!.textContent = data.bungieName
  setLoading('#names-container', false);
}

async function fetchCommendations(membershipType: number, membershipId: string) {
  const response = await fetch('/api/commendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ membershipType, membershipId }),
  });
  return await response.json();
}

async function fetchSummary (profile: PlayerDataForChatGPT) {
  const stringifiedProfile = JSON.stringify(profile);
  console.log("Sending this to allies report server: ", stringifiedProfile)
  const response = await fetch('/api/summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: stringifiedProfile,
  });
  return response.text();
}

function renderActivityPointsChartAndCategories(data: any) {
  console.log(data);
  // Render activityPointsChart with the data
  setLoading('#activityPointsChart', false);
  setLoading('#categories', false);
  renderCommendationsAndActivities(data);
}

function renderChatGPTSummary(summary: string) {
  console.log(summary);
  const summaryElement = document.getElementById('#chatGPT-summary');
  summaryElement!.textContent = summary;
  // Render chatGPTSummary with the data
  setLoading('#chatGPT-summary', false);
}

// Initialize
(async function () {
  const { membershipType, membershipId, bungieGlobalDisplayName, bungieName } = initialData;
  renderNamesContainer({ bungieGlobalDisplayName, bungieName });

  const commendations : CommendationSummary = await fetchCommendations(membershipType, membershipId);
  renderActivityPointsChartAndCategories(commendations);

  const forBot = { name: bungieGlobalDisplayName, commendationSummary: commendations };

  console.log("Prepared data for allies report server: ", forBot)
  const summary = await fetchSummary(forBot);
  renderChatGPTSummary(summary);
})();
