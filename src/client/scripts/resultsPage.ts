const testInput = {"totalScore":2713,"given":496,"received":435,"categories":[{"name":"Leadership","commendations":[{"name":"Perceptive","value":55},{"name":"Knowledgeable","value":30}]},{"name":"Mastery","commendations":[{"name":"Playmaker","value":45},{"name":"Primeval Instinct","value":9},{"name":"Heroic","value":28},{"name":"Pacesetter","value":39}]},{"name":"Ally","commendations":[{"name":"Indispensable","value":39},{"name":"Selfless","value":8},{"name":"Thoughtful","value":33},{"name":"Patient and Considerate","value":15}]},{"name":"Fun","commendations":[{"name":"Joy Bringer","value":56},{"name":"Level-headed","value":36},{"name":"Saint's Favorite","value":42}]}],"activityPoints":{"crucible":81,"trials":81,"gambit":45,"casualPve":89,"endgamePve":69,"raidsAndDungeons":136}};

type Category = {
    name: string;
    commendations: Array<{ name: string; value: number }>;
  };
  
  type ActivityPoints = {
    [key: string]: number;
  };
  
  type Data = {
    categories: Category[];
    activityPoints: ActivityPoints;
  };
  
  const data: Data = testInput;
  
  const categoriesContainer = document.getElementById('categories') as HTMLElement;
  
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
  
  const categoryNames = document.querySelectorAll('.category-name');
  
  categoryNames.forEach((categoryName) => {
    const textContent = categoryName.textContent.toLowerCase();
  
    if (textContent.includes('mastery')) {
      categoryName.style.backgroundColor = '#e6c755';
    } else if (textContent.includes('leadership')) {
      categoryName.style.backgroundColor = '#4fa7c3';
    } else if (textContent.includes('ally')) {
      categoryName.style.backgroundColor = '#70b56f';
    } else if (textContent.includes('fun')) {
      categoryName.style.backgroundColor = '#c34f80';
    }
  });
  
// Activity points visualization
const activityPointsLabels = Object.keys(data.activityPoints);
const activityPointsValues = Object.values(data.activityPoints);

const totalActivityPoints = activityPointsValues.reduce((a, b) => a + b, 0);
const activityPointsPercentages = activityPointsValues.map(value => (value / totalActivityPoints) * 100);

const colorPalette: { [key: string]: string } = {
  "crucible": "#FFA3A3",
  "trials": "#F5E5B5",
  "gambit": "#599580",
  "casualPve": "#8EBED6",
  "endgamePve": "#6C73A8",
  "raidsAndDungeons": "#80CBC4"
};

type SortedActivityPoint = {
  label: string;
  data: number[];
  backgroundColor: string;
};

const sortedActivityPoints: SortedActivityPoint[] = activityPointsLabels
  .map((label, index) => ({
    label: label,
    data: [activityPointsPercentages[index]],
    backgroundColor: colorPalette[label],
  }))
  .sort((a, b) => b.data[0] - a.data[0]);


  const ctx = (document.getElementById('activityPointsChart') as HTMLCanvasElement).getContext('2d');
  let delayed: boolean;
  
  const activityPointsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Commendations received by activity'],
      datasets: sortedActivityPoints,
    },
    options: {
      animation: {
        onComplete: () => {
          delayed = true;
        },
        delay: (context: any) => {
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
                        const label = context.dataset.label || '';
                        const value = context.parsed.x;
                        return label + ': ' + value.toFixed(2) + '%';
                    }
                }
            },
        },
        maintainAspectRatio: false,
    },
});
