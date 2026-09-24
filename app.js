// This file is the JavaScript entry point for the game.
// The browser still loads it from index.html, which provides the stylesheet.

const app = document.createElement("div");
app.innerHTML = `
  <main class="game-wrap" aria-labelledby="app-title">
    <span class="sparkle one" aria-hidden="true">✦</span>
    <span class="sparkle two" aria-hidden="true">✧</span>
    <section class="game-content">
      <header>
        <h1 id="app-title" class="app-title">Tic Tac Toe</h1>
        <p class="subtitle">A cozy little game of X and O</p>
      </header>
      <section class="game-panel" aria-label="Tic Tac Toe game">
        <div class="turn-card" aria-live="polite" aria-atomic="true">
          <span id="turn-dot" class="turn-dot" aria-hidden="true"></span>
          <span id="turn-label"></span>
        </div>
        <div class="player-row" aria-label="Players">
          <div id="x-player" class="player-chip active"><span class="player-x" aria-hidden="true">X</span> Player X</div>
          <div id="o-player" class="player-chip"><span class="player-o" aria-hidden="true">O</span> Player O</div>
        </div>
        <div id="board" class="board" role="grid" aria-label="Tic Tac Toe board"></div>
        <div class="status-area" aria-live="assertive" aria-atomic="true">
          <div id="x-win-message" class="result-message">Player X wins! Lovely move.</div>
          <div id="o-win-message" class="result-message">Player O wins! Nicely played.</div>
          <div id="draw-message" class="result-message draw-message">It’s a draw — so close!</div>
        </div>
        <div class="action-row">
          <button id="reset-game" type="button" class="action-button reset-button">Reset Game</button>
          <button id="play-again" type="button" class="action-button play-button" hidden>Play Again</button>
        </div>
        <section class="theme-area" aria-labelledby="theme-heading">
          <div class="theme-topline"><div>
            <h2 id="theme-heading" class="theme-heading">Theme</h2>
            <p class="theme-helper">Pick a palette that feels good to play in.</p>
          </div></div>
          <div class="theme-options" role="group" aria-label="Color theme choices">
            <button type="button" data-theme="warm" class="theme-option warm" aria-pressed="true">Warm</button>
            <button type="button" data-theme="lavender" class="theme-option lavender" aria-pressed="false">Lavender</button>
            <button type="button" data-theme="sage" class="theme-option sage" aria-pressed="false">Sage</button>
            <button type="button" data-theme="blue" class="theme-option blue" aria-pressed="false">Blue</button>
            <button type="button" data-theme="peach" class="theme-option peach" aria-pressed="false">Peach</button>
          </div>
        </section>
      </section>
    </section>
  </main>`;
document.body.append(app);

const themes = {
  warm: { pageBg: "#fbf3e8", panel: "#fffdf9", board: "#fffaf3", ink: "#3e2b26", muted: "#796861", line: "#ead5c3", x: "#b95743", o: "#3f6d73", accent: "#b95743", softAccent: "#f4d9cf", win: "#f5df91", shadow: "rgba(89, 55, 42, 0.14)" },
  lavender: { pageBg: "#f4f0fa", panel: "#fefcff", board: "#faf7fe", ink: "#302445", muted: "#6d637c", line: "#ddd2e8", x: "#8f4e88", o: "#4b5192", accent: "#5c3b83", softAccent: "#e4dcf4", win: "#e5d390", shadow: "rgba(57, 39, 80, 0.15)" },
  sage: { pageBg: "#f1f5ec", panel: "#fdfffa", board: "#f8fbf4", ink: "#263c2c", muted: "#627166", line: "#d1dfc9", x: "#ad5347", o: "#2f6a49", accent: "#2f6a49", softAccent: "#dce9d6", win: "#dfe29b", shadow: "rgba(41, 76, 48, 0.14)" },
  blue: { pageBg: "#eef5fa", panel: "#fbfdff", board: "#f5faff", ink: "#20324d", muted: "#61708a", line: "#ccdeeb", x: "#b64c5c", o: "#245b91", accent: "#245b91", softAccent: "#d9e9f5", win: "#e5d58f", shadow: "rgba(34, 68, 110, 0.14)" },
  peach: { pageBg: "#fff1e9", panel: "#fffdfb", board: "#fff8f3", ink: "#482833", muted: "#7e6167", line: "#efcfbf", x: "#9d3d50", o: "#5f657f", accent: "#7f3043", softAccent: "#f6d7c4", win: "#f2da90", shadow: "rgba(103, 49, 54, 0.14)" }
};
const positions = ["Top left", "Top middle", "Top right", "Middle left", "Center", "Middle right", "Bottom left", "Bottom middle", "Bottom right"];
const winningLines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const board = document.getElementById("board");
positions.forEach((position, index) => {
  const cell = document.createElement("button");
  cell.className = "cell";
  cell.type = "button";
  cell.setAttribute("role", "gridcell");
  cell.dataset.index = index;
  cell.setAttribute("aria-label", `${position}, empty`);
  board.append(cell);
});
const cells = [...board.querySelectorAll(".cell")];
const turnLabel = document.getElementById("turn-label");
const turnDot = document.getElementById("turn-dot");
const xPlayer = document.getElementById("x-player");
const oPlayer = document.getElementById("o-player");
const playAgain = document.getElementById("play-again");
const messages = { X: document.getElementById("x-win-message"), O: document.getElementById("o-win-message"), draw: document.getElementById("draw-message") };
let game = Array(9).fill("");
let currentPlayer = "X";
let gameOver = false;

function updateTurnDisplay() {
  if (gameOver) return;
  turnLabel.textContent = `Player ${currentPlayer}’s Turn`;
  const isX = currentPlayer === "X";
  xPlayer.classList.toggle("active", isX);
  oPlayer.classList.toggle("active", !isX);
  turnDot.style.backgroundColor = isX ? "var(--x)" : "var(--o)";
}
function clearMessages() { Object.values(messages).forEach(message => message.classList.remove("show")); }
function findWinner() {
  for (const line of winningLines) {
    const [a,b,c] = line;
    if (game[a] && game[a] === game[b] && game[a] === game[c]) return { player: game[a], line };
  }
  return null;
}
function endGame(result) {
  gameOver = true;
  cells.forEach(cell => { cell.disabled = true; });
  xPlayer.classList.remove("active");
  oPlayer.classList.remove("active");
  turnLabel.textContent = "Game complete";
  if (result.player) {
    result.line.forEach(index => cells[index].classList.add("winner"));
    messages[result.player].classList.add("show");
  } else messages.draw.classList.add("show");
  playAgain.hidden = false;
}
function makeMove(index) {
  if (gameOver || game[index]) return;
  game[index] = currentPlayer;
  const cell = cells[index];
  const mark = document.createElement("span");
  mark.textContent = currentPlayer;
  cell.append(mark);
  cell.classList.add("placed", currentPlayer === "X" ? "mark-x" : "mark-o");
  cell.disabled = true;
  cell.setAttribute("aria-label", `${positions[index]}, ${currentPlayer}`);
  const winner = findWinner();
  if (winner) return endGame(winner);
  if (game.every(Boolean)) return endGame({});
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateTurnDisplay();
}
function resetGame() {
  game = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;
  clearMessages();
  playAgain.hidden = true;
  cells.forEach((cell, index) => {
    cell.disabled = false;
    cell.className = "cell";
    cell.replaceChildren();
    cell.setAttribute("aria-label", `${positions[index]}, empty`);
  });
  updateTurnDisplay();
  cells[0].focus();
}
function applyTheme(themeName) {
  const theme = themes[themeName];
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme)) {
    const cssName = key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
    root.style.setProperty(`--${cssName}`, value);
  }
  document.querySelectorAll(".theme-option").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.theme === themeName)));
}
cells.forEach(cell => cell.addEventListener("click", () => makeMove(Number(cell.dataset.index))));
document.getElementById("reset-game").addEventListener("click", resetGame);
playAgain.addEventListener("click", resetGame);
document.querySelectorAll(".theme-option").forEach(button => button.addEventListener("click", () => applyTheme(button.dataset.theme)));
updateTurnDisplay();
