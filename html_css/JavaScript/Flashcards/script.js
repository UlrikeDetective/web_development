/**
 * Loads the flashcard data from a JSON file.
 * @returns {Promise<Array>} The flashcard sets data.
 */
async function loadData() {
  const response = await fetch("data.json");

  if (!response.ok) {
    throw new Error("Could not load data.");
  }

  return response.json();
}

/**
 * Creates a card element for a flashcard set.
 * @param {Object} set The flashcard set data.
 * @returns {HTMLElement} The created set card element.
 */
function createSetCard(set) {
  const card = document.createElement("article");

  card.className = "set-card";
  card.innerHTML = `<h3>${set.title}</h3><p>${set.description}</p>`;

  // When a set is clicked, render its individual cards
  card.addEventListener("click", () => {
    renderSetCards(set);
  });

  return card;
}

// Global variable to store the loaded flashcard data
let flashcardData = null;

/**
 * Renders the individual cards within a selected flashcard set.
 * @param {Object} set The flashcard set to display.
 */
function renderSetCards(set) {
  const cardsSection = document.createElement("section");

  const title = document.createElement("h2");
  title.className = "section-title";
  title.textContent = "Set: " + set.title;
  cardsSection.appendChild(title);

  const cardsContainer = document.createElement("div");
  cardsContainer.className = "cards-container";

  set.cards.forEach((card) => {
    const cardContainer = document.createElement("article");
    cardContainer.className = "card";

    const inner = document.createElement("div");
    inner.className = "card-inner";
    inner.innerHTML = `<p class="card-face card-front">${card.front}</p><p class="card-face card-back">${card.back}</p>`;

    // Click to flip the card
    inner.addEventListener("click", (e) => {
      e.stopPropagation();
      cardContainer.classList.toggle("flipped");
    });

    cardContainer.appendChild(inner);
    cardsContainer.appendChild(cardContainer);
  });

  cardsSection.appendChild(cardsContainer);

  // Button to return to the set selection view
  const backBtn = document.createElement("button");
  backBtn.className = "back-btn";
  backBtn.textContent = "Back to sets";
  backBtn.addEventListener("click", () => {
    renderAllSets();
  });
  cardsSection.appendChild(backBtn);

  const app = document.getElementById("app");
  app.innerHTML = "";
  app.appendChild(cardsSection);
}

/**
 * Renders the list of all available flashcard sets.
 */
function renderAllSets() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const setsSection = document.createElement("section");
  setsSection.className = "sets-section";

  flashcardData.forEach((set) => {
    setsSection.appendChild(createSetCard(set));
  });

  app.appendChild(setsSection);
}

/**
 * Main function to initialize the application.
 */
async function renderContent() {
  try {
    flashcardData = await loadData();

    renderAllSets();
  } catch (err) {
    console.error(err);

    document.getElementById("app").textContent =
      "Could not load flashcards data.";
  }
}

// Start the application
renderContent();