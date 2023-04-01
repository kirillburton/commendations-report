// This file will be responsible for rendering the results page and managing the loading animations.
// todo: create functions to show and hide loading animations 
// while data is being fetched. 
// Use these functions in conjunction with the data received from the APIs to update the resultsPage.html content.

// Pass initialData from the resultsPage.html
import { CommendationSummary, PlayerNamesAndMembership, Temp } from "../../types/customTypes.js";

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
  const container = document.getElementById('namesContainer')!;
  container.innerHTML = `
    <h2>${data.bungieGlobalDisplayName}</h2>
    <p>${data.bungieName}</p>
  `;
  setLoading('namesContainer', false);
}

async function fetchCommendations(membershipType: number, membershipId: string) {
  const response = await fetch('/api/commendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ membershipType, membershipId }),
  });
  return await response.json();
}

async function fetchSummary(profile: any) {
  const response = await fetch('/api/summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile }),
  });
  return await response.json();
}

function renderActivityPointsChartAndCategories(data: any) {
  console.log(data);
  // Render activityPointsChart with the data
  setLoading('activityPointsChart', false);
  setLoading('categories', false);
}

function renderChatGPTSummary(data: any) {
  console.log(data);
  // Render chatGPTSummary with the data
  setLoading('chatGPTSummary', false);
}

// Initialize
(async function () {
  const { membershipType, membershipId, bungieGlobalDisplayName, bungieName } = initialData;
  renderNamesContainer({ bungieGlobalDisplayName, bungieName });

  const commendations : CommendationSummary = await fetchCommendations(membershipType, membershipId);
  renderActivityPointsChartAndCategories(commendations);

  const forBot : Temp = { playerProfile: initialData, commendationSummary: commendations };

  const summary = await fetchSummary(forBot);
  renderChatGPTSummary(summary);
})();
