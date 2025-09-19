let quizAnswers = [];

// Collect quiz answers
function answer(mood) {
  quizAnswers.push(mood);
}

// Show recommendations based on quiz result
async function showQuizResults() {
  const movieList = document.getElementById("movieList");
  movieList.innerHTML = "";

  if (quizAnswers.length === 0) {
    movieList.innerHTML = "<p>Please answer the quiz first!</p>";
    return;
  }

  // Count most frequent mood
  const moodCount = {};
  quizAnswers.forEach(m => {
    moodCount[m] = (moodCount[m] || 0) + 1;
  });

  const topMood = Object.keys(moodCount).reduce((a, b) =>
    moodCount[a] > moodCount[b] ? a : b
  );

  try {
    const response = await fetch("movies.json");
    const movieDatabase = await response.json();

    if (movieDatabase[topMood]) {
      movieList.innerHTML = `<h3>You’re in the mood for <span class="highlight">${topMood}</span> movies!</h3>`;

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

  // Hide quiz, show results
  document.getElementById("quiz").style.display = "none";
  document.getElementById("results").style.display = "block";

  // Reset answers for next quiz run
  quizAnswers = [];
}

// Restart quiz
function restartQuiz() {
  document.getElementById("quiz").style.display = "block";
  document.getElementById("results").style.display = "none";
}
