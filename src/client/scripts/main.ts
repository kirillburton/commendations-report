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

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.attributeName === 'disabled') {
                const element = mutation.target as HTMLElement;
                if (element.classList.contains('load-animation')) {
                    element.classList.remove('load-animation');
                } else {
                    element.classList.add('load-animation');
                }
            }
        });
    });

    observer.observe(searchInput, {
        attributes: true
    });

    async function handleSearch(event: Event) {
        const bungieName = (event.target as HTMLInputElement).value.trim();
        if (bungieName) {
            (event.target as HTMLInputElement).disabled = true;
            searchInput.classList.add('has-text');
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
                    const searchInputInDropdownState =
                        renderDropdownMenu(bungieName);

                    // Get the ul element for the dropdown menu
                    const dropdownMenu = document.querySelector(
                        '.dropdown_menu'
                    ) as HTMLUListElement;

                    // Populate the dropdown menu with options
                    playerNamesAndMembershipsArray.forEach((player, index) => {
                        const li = document.createElement('li');
                        li.textContent = player.bungieName;
                        li.classList.add('dropdown_item-' + (index + 1)); // Add class to the li
                        li.addEventListener('click', async () => {
                            // Set playerNamesAndMemberships based on user's choice
                            playerNamesAndMemberships =
                                playerNamesAndMembershipsArray[index];

                            // Clean up dropdown
                            while (dropdownMenu.firstChild) {
                                dropdownMenu.removeChild(
                                    dropdownMenu.firstChild
                                );
                            }
                            goToResults(playerNamesAndMemberships);
                        });
                        dropdownMenu.appendChild(li);
                        searchInputInDropdownState.classList.add(
                            'emulated-hover'
                        );
                        searchInputInDropdownState.style.borderColor =
                            '#e9e9e9';
                        searchInput.style.visibility = 'false';
                    });
                } else {
                    goToResults(
                        playerNamesAndMemberships as PlayerNamesAndMembership
                    );
                }
            } else {
                console.error('Error fetching player names and membership');
                (event.target as HTMLInputElement).disabled = false;
                const searchInputInDropdownState =
                    renderDropdownMenu(bungieName);
                const dropdownMenu = document.querySelector(
                    '.dropdown_menu'
                ) as HTMLUListElement;
                const li = document.createElement('li');
                li.textContent = 'player not found';
                li.style.fontStyle = 'italic';
                li.style.fontSize = 'medium';
                li.classList.add('dropdown_item-1');
                dropdownMenu.appendChild(li);
                searchInputInDropdownState.classList.add('emulated-hover');
                searchInputInDropdownState.style.borderColor = '#e9e9e9';
                //searchInput.addEventListener('blur', handleSearch);
            }
        } else {
            searchInput.classList.remove('has-text');
        }
    }

    function renderDropdownMenu(bungieName: string): HTMLElement {
        const searchInputInDropdownState = document.createElement('div');
        searchInputInDropdownState.textContent = bungieName;
        searchInputInDropdownState.classList.add('dropdown', 'searchbar');

        const list = document.createElement('ul');
        list.classList.add('dropdown_menu', 'dropdown_menu-2');

        searchInputInDropdownState.appendChild(list);
        searchInput.parentElement?.appendChild(searchInputInDropdownState);

        searchInputInDropdownState.addEventListener('click', async () => {
            searchInputInDropdownState.remove();
            searchInput.disabled = false;
            searchInput.style.borderColor = '#ddd';
            searchInput.style.visibility = 'true';
            searchInput.focus();
        });

        return searchInputInDropdownState;
    }
});

function goToResults(playerNamesAndMemberships: PlayerNamesAndMembership) {
    const url = new URL('/resultsPage.html', window.location.origin);
    url.searchParams.set(
        'playerNamesAndMembership',
        encodeURIComponent(JSON.stringify(playerNamesAndMemberships))
    );
    window.location.href = url.toString();
}
