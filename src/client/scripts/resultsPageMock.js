const data = {
    totalScore: 2713,
    given: 496,
    received: 435,
    categories: [
        {
            name: 'Leadership',
            commendations: [
                { name: 'Perceptive', value: 55 },
                { name: 'Knowledgeable', value: 30 }
            ]
        },
        {
            name: 'Mastery',
            commendations: [
                { name: 'Playmaker', value: 45 },
                { name: 'Primeval Instinct', value: 9 },
                { name: 'Heroic', value: 28 },
                { name: 'Pacesetter', value: 39 }
            ]
        },
        {
            name: 'Ally',
            commendations: [
                { name: 'Indispensable', value: 39 },
                { name: 'Selfless', value: 8 },
                { name: 'Thoughtful', value: 33 },
                { name: 'Patient and Considerate', value: 15 }
            ]
        },
        {
            name: 'Fun',
            commendations: [
                { name: 'Joy Bringer', value: 56 },
                { name: 'Level-headed', value: 36 },
                { name: "Saint's Favorite", value: 42 }
            ]
        }
    ],
    activityPoints: {
        crucible: 81,
        trials: 81,
        gambit: 45,
        casualPve: 89,
        endgamePve: 69,
        raidsAndDungeons: 136
    }
};

const categoriesContainer = document.getElementById('categories');

data.categories.forEach((category) => {
    const categoryElement = document.createElement('div');
    categoryElement.classList.add('category');

    const categoryNameElement = document.createElement('div');
    categoryNameElement.classList.add('category-name');
    categoryNameElement.textContent = category.name;
    categoryElement.appendChild(categoryNameElement);

    const commendationsElement = document.createElement('div');
    commendationsElement.classList.add('commendations');
    categoryElement.appendChild(commendationsElement);
    const commendationElement = document.createElement('div');
    commendationElement.classList.add('commendation');

    category.commendations.forEach((commendation) => {
        const commendationCardWrapper = document.createElement('div');
        commendationCardWrapper.classList.add('commendation-card-wrapper');

        const commendationCardElement = document.createElement('div');
        commendationCardElement.classList.add('commendation-card');

        const commendationValueElement = document.createElement('span');
        commendationValueElement.classList.add('commendation-value');
        commendationValueElement.textContent = commendation.value;
        commendationCardElement.appendChild(commendationValueElement);

        const commendationNameElement = document.createElement('span');
        commendationNameElement.classList.add('commendation-name');
        commendationNameElement.textContent = commendation.name;

        commendationCardWrapper.appendChild(commendationCardElement);
        commendationCardWrapper.appendChild(commendationNameElement);
        commendationElement.appendChild(commendationCardWrapper);
        commendationsElement.appendChild(commendationElement);
    });
    categoriesContainer.appendChild(categoryElement);
});

const categoryNames = document.querySelectorAll('.category-name');

categoryNames.forEach((categoryName) => {
    const textContent = categoryName.textContent.toLowerCase();

    if (textContent.includes('mastery')) {
        categoryName.style.backgroundColor = '#e6c755'; //light variant e6c755 dark variant CC7C2C
    } else if (textContent.includes('leadership')) {
        categoryName.style.backgroundColor = '#4fa7c3'; // light variant 4fa7c3 dark variant 3288C1
    } else if (textContent.includes('ally')) {
        categoryName.style.backgroundColor = '#70b56f'; //light variant 70b56f dark variant 36A289
    } else if (textContent.includes('fun')) {
        categoryName.style.backgroundColor = '#c34f80'; //light variant c34f80 dark variant BD4F69
    }
});

// Activity points visualization
const activityPointsLabels = Object.keys(data.activityPoints);
const activityPointsValues = Object.values(data.activityPoints);

const totalActivityPoints = activityPointsValues.reduce((a, b) => a + b, 0);
const activityPointsPercentages = activityPointsValues.map(
    (value) => (value / totalActivityPoints) * 100
);

const colorPalette = {
    crucible: '#FFA3A3', //light pastel red
    trials: '#F5E5B5', //light pastel yellow
    gambit: '#599580', //light dark pastel green
    casualPve: '#8EBED6', //light pastel blue
    endgamePve: '#6C73A8', //light dark pastel blue
    raidsAndDungeons: '#80CBC4' //light color from raid report
};

const sortedActivityPoints = activityPointsLabels
    .map((label, index) => ({
        label: label,
        data: [activityPointsPercentages[index]],
        backgroundColor: colorPalette[label]
    }))
    .sort((a, b) => b.data[0] - a.data[0]);

const ctx = document.getElementById('activityPointsChart').getContext('2d');
let delayed;
const activityPointsChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Commendations received by activity'],
        datasets: sortedActivityPoints
    },
    options: {
        animation: {
            onComplete: () => {
                delayed = true;
            },
            delay: (context) => {
                let delay = 0;
                if (
                    context.type === 'data' &&
                    context.mode === 'default' &&
                    !delayed
                ) {
                    delay =
                        context.dataIndex * 300 + context.datasetIndex * 100;
                }
                return delay;
            }
        },
        indexAxis: 'y',
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false
                },
                ticks: {
                    display: false
                },
                border: {
                    display: false
                }
            },
            y: {
                stacked: true,
                grid: {
                    display: false
                },
                ticks: {
                    display: false
                },
                border: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.dataset.label || '';
                        const value = context.parsed.x;
                        return label + ': ' + value.toFixed(2) + '%';
                    }
                }
            }
        },
        maintainAspectRatio: false
    }
});
