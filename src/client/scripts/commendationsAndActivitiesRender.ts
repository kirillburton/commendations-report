import { CommendationSummary } from "customTypes.js";
import { Chart } from 'chart.js/auto';

export function renderCommendationsAndActivities(commendationsSummary: CommendationSummary) {

    
    const categoriesContainer = document.getElementById('#categories') as HTMLDivElement;

    const countWrapper = document.getElementById('#commendations-count') as HTMLDivElement;
    const commendationCountElement = document.createElement('span');
    commendationCountElement.classList.add('text-description');
    commendationCountElement.innerHTML = `Points: <strong>${commendationsSummary.totalScore}</strong><br>Received: <strong>${commendationsSummary.received}</strong>`;
    countWrapper.appendChild(commendationCountElement);

    commendationsSummary.categories.forEach((category) => {
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
            commendationValueElement.textContent = commendation.value.toString();
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

    const categoryNames: NodeListOf<Element> = document.querySelectorAll('.category-name');

    categoryNames.forEach((categoryName: Element) => {
    const textContent = categoryName.textContent?.toLowerCase() || '';
    
    if (textContent.includes('mastery')) {
        (categoryName as HTMLElement).style.backgroundColor = '#e6c755'; //light variant e6c755 dark variant CC7C2C
    } else if (textContent.includes('leadership')) {
        (categoryName as HTMLElement).style.backgroundColor = '#4fa7c3'; // light variant 4fa7c3 dark variant 3288C1
    } else if (textContent.includes('ally')) {
        (categoryName as HTMLElement).style.backgroundColor = '#70b56f'; //light variant 70b56f dark variant 36A289
    } else if (textContent.includes('fun')) {
        (categoryName as HTMLElement).style.backgroundColor = '#c34f80'; //light variant c34f80 dark variant BD4F69
    }
    });

    // Activity points visualization
    const activityPointsLabels = Object.keys(commendationsSummary.activityPoints);
    const activityPointsValues = Object.values(commendationsSummary.activityPoints);
    const totalActivityPoints = activityPointsValues.reduce((a, b) => a + b, 0);
    const activityPointsPercentages = activityPointsValues.map(value => (value / totalActivityPoints) * 100);
    
    interface ColorPalette {
        [key: string]: string;
    }
    
    const colorPalette: ColorPalette = {
        "crucible": "#FFA3A3", //light pastel red
        "trials": "#F5E5B5", //light pastel yellow
        "gambit": "#599580", //light dark pastel green
        "casualPve": "#8EBED6", //light pastel blue
        "endgamePve": "#6C73A8", //light dark pastel blue
        "raidsAndDungeons": "#80CBC4" //light color from raid report
    };
    
    interface SortedActivityPoint {
        label: string;
        data: number[];
        backgroundColor: string;
    }
    
    const sortedActivityPoints: SortedActivityPoint[] = activityPointsLabels
        .map((label: string, index: number) => ({
            label: label,
            data: [activityPointsPercentages[index]],
            backgroundColor: colorPalette[label],
        }))
        .sort((a: SortedActivityPoint, b: SortedActivityPoint) => b.data[0] - a.data[0]);
    
    const canvas = document.getElementById('#activityPointsChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');  
    let delayed: boolean;
      
      
    if (ctx !== null) {
        new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['Commendations count:'],
              datasets: sortedActivityPoints,
            },
            options: {
              animation: {
                onComplete: () => {
                  delayed = true;
                },
                delay: (context: { type: string; mode: string; dataIndex: number; datasetIndex: number }) => {
                  let delay = 0;
                  if (context.type === 'data' && context.mode === 'default' && !delayed) {
                    delay = context.dataIndex * 300 + context.datasetIndex * 100;
                  }
                  return delay;
                },
              },
              indexAxis: 'y',
              scales: {
                x: {
                  stacked: true,
                  grid: {
                    display: false,
                  },
                  ticks: {
                    display: false,
                  },
                  border: {
                    display: false,
                  },
                },
                y: {
                  stacked: true,
                  grid: {
                    display: false,
                  },
                  ticks: {
                    display: false,
                  },
                  border: {
                    display: false,
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            const count = activityPointsValues[activityPointsLabels.indexOf(label)];
                            switch (label) {
                              case "crucible":
                                label = "Crucible";
                                break;
                              case "trials":
                                label = "Trials of Osiris";
                                break;
                              case "gambit":
                                label = "Gambit";
                                break;
                              case "casualPve":
                                label = "Matchmade PvE";
                                break;
                              case "endgamePve":
                                label = "Non-matchmade PvE";
                                break;
                              case "raidsAndDungeons":
                                label = "Raids & Dungeons";
                                break;    
                              default:
                                break;
                            }
                            const value = context.parsed.x;
                            return `${count} – ${label}: ${value.toFixed(2)}%`;
                        }
                    }
                },
            },
            maintainAspectRatio: false,
        },
    });
    } else {
        console.error('Could not get the 2D rendering context for the canvas.');
    }
}