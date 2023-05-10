// This file will be responsible for rendering the results page and managing the loading animations.
// todo: create functions to show and hide loading animations
// while data is being fetched.
// Use these functions in conjunction with the data received from the APIs to update the resultsPage.html content.

// Pass initialData from the resultsPage.html
import {
    CommendationSummary,
    PlayerNamesAndMembership,
    PlayerDataForChatGPT
} from '../../types/customTypes';
import { renderCommendationsAndActivities } from './commendationsAndActivitiesRender';

const urlParams = new URLSearchParams(window.location.search);
const initialDataString = urlParams.get('playerNamesAndMembership') || '';
const initialData = JSON.parse(
    decodeURIComponent(initialDataString)
) as PlayerNamesAndMembership;

function setLoading(elementId: string, loading: boolean) {
    const element = document.getElementById(elementId)!;
    if (loading) {
        element.classList.add('loading');
    } else {
        element.style.display = 'none';
    }
}

const header = document.getElementById('#header-link') as HTMLDivElement;

header.addEventListener('click', () => {
    const url = new URL('/index.html', window.location.origin);
    window.location.href = url.toString();
});

async function fetchCommendations(
    membershipType: number,
    membershipId: string
) {
    const response = await fetch('/api/commendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipType, membershipId })
    });
    return await response.json();
}

async function fetchSummary(profile: PlayerDataForChatGPT) {
    const stringifiedProfile = JSON.stringify(profile);
    console.log('Sending this to allies report server: ', stringifiedProfile);
    const response = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: stringifiedProfile
    });
    return response.text();
}

function renderActivityPointsChartAndCategories(data: any) {
    console.log(data);
    // Render activityPointsChart with the data
    setLoading('#activities-loading', false);
    setLoading('#commendation-category-loading-container', false);
    setLoading('#commendations-count-loading-wrapper', false);
    renderCommendationsAndActivities(data);
}

function renderChatGPTSummary(summary: string) {
    console.log(summary);
    const formattedSummary = summary
        .replace('SUMMARY:', '<strong>SUMMARY:</strong><br>')
        .replace(
            'EXPERIENCED IN:',
            '<br><br><strong>EXPERIENCED IN:</strong><br>'
        );

    const summaryElement = document.getElementById('#chatGPT-summary');

    if (summaryElement) {
        const loadedSummaryElement = document.createElement('span');
        loadedSummaryElement.innerHTML = formattedSummary;
        setLoading('#summary-loading', false);
        summaryElement.appendChild(loadedSummaryElement);
    } else {
        console.error('Summary element not found on the page');
    }
    // Render chatGPTSummary with the data
}

// Initialize
(async function () {
    const {
        membershipType,
        membershipId,
        bungieGlobalDisplayName,
        bungieName
    } = initialData;
    const displayNameElement = document.getElementById('#display-name');
    const bungieNameElement = document.getElementById('#bungie-name');
    displayNameElement!.textContent = bungieGlobalDisplayName.toUpperCase();
    bungieNameElement!.textContent = '#' + bungieName.split('#')[1];

    const commendations: CommendationSummary = await fetchCommendations(
        membershipType,
        membershipId
    );
    renderActivityPointsChartAndCategories(commendations);

    const forBot = {
        name: bungieGlobalDisplayName,
        commendationSummary: commendations
    };

    console.log('Prepared data for allies report server: ', forBot);
    const summary = await fetchSummary(forBot);
    renderChatGPTSummary(summary);
})();
