# Side Scrolling Life

A browser-based pixel-art side scroller following a journey from Porto through Europe and Asia, back to Porto for a wedding celebration.

The game is deliberately dependency-free: open `index.html` in a modern browser or serve the repository as a static site.

## Controls

| Input | Action |
| --- | --- |
| `A` / `D` or arrow keys | Move left or right |
| `W`, `↑`, or `Space` | Jump; press again in the air for a double jump |
| `Shift` | Accelerate faster, up to the 200% speed cap |
| `1`–`9` or numeric keypad `1`–`9` | Teleport to the matching stage |
| `R` | Restart the journey |

Touch controls appear automatically on mobile devices.

## Stages

1. Porto — the beginning
2. Porto — the couple meets
3. Spain, France, and Belgium
4. Amsterdam
5. Japan
6. Korea
7. Amsterdam — Kyuubi joins the journey
8. Belgium, France, and Spain on the return trip
9. Porto — wedding finale with the waiting crowd, flames, and confetti

## Enemies

- Porto: children in blue shirts with white stripes
- Spain: bulls
- France: baguettes
- Belgium: no enemies
- Amsterdam: cyclists
- Japan: ninjas
- Korea: chefs carrying knives

## Running locally

No build step is required.

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Testing

The smoke test uses only Node.js built-in modules. It validates that:

- `index.html` is a complete, uncompressed HTML document;
- the game boots and draws to the canvas;
- every location has the intended enemy type and Belgium has none;
- number-key stage teleporting works;
- double jump works and prevents a third jump;
- acceleration reaches the intended rate without exceeding the 200% speed cap;
- Kyuubi is recruited and trails behind the player.

Run the tests with:

```bash
npm test
```

GitHub Actions runs the same test on every push and pull request.

## Architecture

The project is split into small static files:

- `index.html` contains the page structure and boot watchdog.
- `styles.css` contains the readable UI and responsive canvas layout.
- `game-core.js` contains state, input, physics, stage teleporting, double jump, and dog-follow logic.
- `game-world.js` contains pixel-art landmarks and world scenery.
- `game-render.js` contains characters, themed enemies, effects, and the animation loop.
- `tests/game.test.mjs` boots the scripts inside a lightweight DOM and canvas harness.
- `.github/workflows/test.yml` runs the test suite in CI.

The game exposes a frozen `window.__SIDE_SCROLLING_LIFE__` test interface. It is used for deterministic smoke tests and is not required for normal gameplay.
