# Cozy Tic Tac Toe

A small, responsive two-player Tic Tac Toe game built with HTML, CSS, and vanilla JavaScript. Two players take turns placing X and O on a 3 × 3 board. The game detects wins and draws, highlights a winning line, and offers several color themes.

## Features

- Two-player turn taking with a clear indicator for the active player.
- Win detection across rows, columns, and diagonals.
- Draw detection when all squares are filled without a winner.
- Winning-line highlighting and result messages.
- Reset Game and Play Again controls.
- Five selectable themes: Warm, Lavender, Sage, Blue, and Peach.
- Responsive layout, keyboard-operable buttons, and accessible status announcements.
- Reduced-motion support for people who prefer less animation.

## Project files

- `index.html` — the page entry point and the game's CSS styles.
- `app.js` — creates the game interface in the browser, manages game state and interactions, and applies themes.

The HTML file is still required: it gives the browser a page to open and loads the JavaScript. The JavaScript creates the game interface after it loads. The CSS in `index.html` styles that interface.

## Run the game

Open `index.html` in a modern web browser. No build step or package installation is needed.

For the JavaScript-generated interface to appear, `index.html` must load `app.js` before its closing `</body>` tag:

```html
<script src="./app.js"></script>
</body>
```

The game uses the Fraunces and DM Sans fonts from Google Fonts. If those fonts cannot load, the browser uses its fallback fonts.

## How to play

1. Player X starts. Select any empty square to place a mark.
2. Players alternate turns.
3. The first player to make a line of three matching marks wins.
4. If all nine squares are filled without a line of three, the game is a draw.
5. Choose **Play Again** to start a fresh round, or **Reset Game** at any time. Choose a theme to change the colors.

## Built with

- HTML for the browser entry point.
- CSS for layout, colors, responsive behavior, and animations.
- Vanilla JavaScript for generating the interface and implementing gameplay.
