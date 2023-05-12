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
                let playerNamesAndMemberships:
                    | PlayerNamesAndMembership
                    | PlayerNamesAndMembership[]
                    | undefined = await response.json();

                if (Array.isArray(playerNamesAndMemberships)) {
                    // TypeScript now knows this is an array
                    const playerNamesAndMembershipsArray =
                        playerNamesAndMemberships;

                    // Create a datalist element
                    const datalist = document.createElement('datalist');
                    datalist.id = 'playerNamesAndMembershipsOptions';

                    // Populate the datalist with options
                    playerNamesAndMembershipsArray.forEach((player) => {
                        const option = document.createElement('option');
                        option.value = player.bungieName;
                        datalist.appendChild(option);
                    });

                    // Attach datalist to the input element
                    searchInput.setAttribute(
                        'list',
                        'playerNamesAndMembershipsOptions'
                    );
                    document.body.appendChild(datalist);
                    searchInput.disabled = false;

                    const waitForSelection = (): Promise<string> => {
                        return new Promise((resolve) => {
                            searchInput.addEventListener(
                                'change',
                                (event) => {
                                    const selectedName = (
                                        event.target as HTMLInputElement
                                    ).value;
                                    resolve(selectedName);
                                },
                                { once: true }
                            ); // Listener will be removed after it runs once
                        });
                    };

                    // Wait for the user to select an option
                    const selectedName = await waitForSelection();
                    playerNamesAndMemberships =
                        playerNamesAndMembershipsArray.find(
                            (player) => player.bungieName === selectedName
                        );

                    // Clean up datalist
                    document.body.removeChild(datalist);
                }

                const url = new URL(
                    '/resultsPage.html',
                    window.location.origin
                );
                url.searchParams.set(
                    'playerNamesAndMembership',
                    encodeURIComponent(
                        JSON.stringify(playerNamesAndMemberships)
                    )
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
