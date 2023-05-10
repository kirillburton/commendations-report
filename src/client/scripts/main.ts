// This file is responsible for handling user input and making search requests to the Koa server.

import { PlayerNamesAndMembership } from '../../types/customTypes.js';

window.addEventListener('pageshow', () => {
    const searchInput = document.getElementById(
        'bungieName'
    ) as HTMLInputElement;
    searchInput.disabled = false;

    searchInput.addEventListener('blur', handleSearch);
    searchInput.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchInput.removeEventListener('blur', handleSearch);
            handleSearch(event);
        }
    });

    async function handleSearch(event: Event) {
        const bungieName = (event.target as HTMLInputElement).value.trim();
        if (bungieName) {
            (event.target as HTMLInputElement).disabled = true;
            const response = await fetch(
                `/api/search/?bungieName=${encodeURIComponent(bungieName)}`
            );
            if (response.ok) {
                const playerNamesAndMembership: PlayerNamesAndMembership =
                    await response.json();
                const url = new URL(
                    '/resultsPage.html',
                    window.location.origin
                );
                url.searchParams.set(
                    'playerNamesAndMembership',
                    encodeURIComponent(JSON.stringify(playerNamesAndMembership))
                );
                window.location.href = url.toString();
            } else {
                console.error('Error fetching player names and membership');
                (event.target as HTMLInputElement).disabled = false;
                searchInput.addEventListener('blur', handleSearch);
            }
        }
    }
});
