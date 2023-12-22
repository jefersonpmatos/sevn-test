async function fetchGamesRounds() {
  try {
    const response = await fetch("https://sevn-pleno-esportes.deno.dev/");

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao obter os dados JSON:", error);
  }
}

fetchGamesRounds()
  .then((jsonData) => {
    roundsData = jsonData;
    renderRoundGames(currentRoundIndex);
  })
  .catch((error) => {
    console.error("Erro geral:", error);
  });

let currentRoundIndex = 0;

async function renderRoundGames(roundIndex) {
  updateButtonState();

  const gameBoard = document.getElementById("gameBoard");
  const roundNumber = document.getElementById("roundNumber");

  if (!roundsData) {
    return;
  }

  const currentRound = roundsData[roundIndex];

  roundNumber.innerHTML = `Rodada ${currentRound.round}`;

  gameBoard.innerHTML = "";

  currentRound.games.map((game) => {
    gameBoard.innerHTML += `
      <div class="game-details">
    <div class="team-home" >

        <img src="/assets/team_shield_${game.team_home_id.slice(
          -1
        )}.png" alt="${game.team_home_name} Shield" />
        <div class="team-name">${game.team_home_name}</div>
        <div class="score">${game.team_home_score}</div>
    </div>

        <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 14 14"
      fill="none"
    >
      <path
        d="M13 1L1 13"
        stroke="#D1D1D1"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M1 1L13 13"
        stroke="#D1D1D1"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>

    <div class="team-away" >
      <div class="score">${game.team_away_score}</div>
      <div class="team-name">${game.team_away_name}</div>
      <img src="/assets/team_shield_${game.team_away_id.slice(-1)}.png" alt="${
      game.team_away_name
    } Shield" />
    </div>
</div>

      `;
  });
}

function updateButtonState() {
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");

  prevButton.disabled = currentRoundIndex === 0;
  nextButton.disabled = currentRoundIndex === roundsData.length - 1;

  prevButton.style.fill = prevButton.disabled ? "#ccc" : "#33B667";
  prevButton.style.stroke = prevButton.disabled ? "#ccc" : "#fff";
  prevButton.style.cursor = prevButton.disabled ? "not-allowed" : "pointer";

  nextButton.style.fill = nextButton.disabled ? "#ccc" : "#33B667";
  nextButton.style.stroke = nextButton.disabled ? "#ccc" : "#fff";
  nextButton.style.cursor = nextButton.disabled ? "not-allowed" : "pointer";
}

function prevRound() {
  if (currentRoundIndex > 0) {
    currentRoundIndex--;
    renderRoundGames(currentRoundIndex);
    updateButtonState();
  }
}

function nextRound() {
  if (currentRoundIndex < roundsData.length - 1) {
    currentRoundIndex++;
    renderRoundGames(currentRoundIndex);
    updateButtonState();
  }
}

renderRoundGames(currentRoundIndex);
