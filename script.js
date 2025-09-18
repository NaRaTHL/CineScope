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
