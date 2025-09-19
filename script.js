async function recommendMovies() {
  const selectedMoods = Array.from(document.querySelectorAll("input[type=checkbox]:checked")).map(cb => cb.value);
  const movieList = document.getElementById("movieList");
  movieList.innerHTML = "";

  if (selectedMoods.length === 0) {
    movieList.innerHTML = "<p>Please select at least one mood.</p>";
    return;
  }

  try {
    const response = await fetch("movies.json");
    const movieDatabase = await response.json();

    selectedMoods.forEach(mood => {
      if (movieDatabase[mood]) {
        movieDatabase[mood].forEach(movie => {
          const card = document.createElement("div");
          card.classList.add("movie-card");

          card.innerHTML = `
            <img src="${movie.img}" alt="${movie.title}">
            <div class="movie-info">
              <h3>${movie.title}</h3>
              <p>${movie.desc}</p>
            </div>
          `;
          movieList.appendChild(card);
        });
      }
    });
  } catch (error) {
    movieList.innerHTML = "<p>Error loading movie database.</p>";
    console.error("Error:", error);
  }
}

let quizAnswers = [];

function answer(mood) {
  quizAnswers.push(mood);
}

// Quiz-based recommendation
async function showQuizResults() {
  const movieList = document.getElementById("movieList");
  movieList.innerHTML = "";

  if (quizAnswers.length === 0) {
    movieList.innerHTML = "<p>Please answer the quiz first!</p>";
    return;
  }

  // Count answers
  const moodCount = {};
  quizAnswers.forEach(m => {
    moodCount[m] = (moodCount[m] || 0) + 1;
  });

  // Find most frequent mood
  const topMood = Object.keys(moodCount).reduce((a, b) =>
    moodCount[a] > moodCount[b] ? a : b
  );

  try {
    const response = await fetch("movies.json");
    const movieDatabase = await response.json();

    if (movieDatabase[topMood]) {
      movieList.innerHTML = `<h3>We think you’re in the mood for <span class="highlight">${topMood}</span> movies!</h3>`;

      movieDatabase[topMood].forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");
        card.innerHTML = `
          <img src="${movie.img}" alt="${movie.title}">
          <div class="movie-info">
            <h3>${movie.title}</h3>
            <p>${movie.desc}</p>
          </div>
        `;
        movieList.appendChild(card);
      });
    } else {
      movieList.innerHTML = `<p>No movies found for mood: ${topMood}</p>`;
    }
  } catch (error) {
    movieList.innerHTML = "<p>Error loading movie database.</p>";
    console.error("Error:", error);
  }

  // Reset answers so the quiz can be taken again
  quizAnswers = [];
}
