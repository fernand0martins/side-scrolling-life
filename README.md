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

## Editing text

All user-facing copy is centralized in `text.js`. Edit individual entries there to change:

- the page title and HUD labels;
- every stage title and subtitle;
- checkpoint, encounter, game-over, and wedding messages;
- control instructions and accessibility labels;
- startup errors;
- dynamic templates such as stage numbers and the final score.

The file is loaded before the game scripts, so text changes do not require changes to gameplay or rendering code.

## Testing

The smoke tests use only Node.js built-in modules. They validate that:

- `index.html` is a complete, uncompressed HTML document;
- all editable copy is loaded from `text.js`;
- the mobile HUD, banners, and messages use compact sizing;
- the game boots and draws to the canvas;
- every location has the intended enemy type and Belgium has none;
- number-key stage teleporting works;
- double jump works and prevents a third jump;
- acceleration reaches the intended rate without exceeding the 200% speed cap;
- Kyuubi is recruited and trails behind the player;
- mobile controls use non-selectable SVG image assets.

Run the tests with:

```bash
npm test
```

GitHub Actions runs the same test suite on every push and pull request.

## Architecture

The project is split into small static files:

- `index.html` contains the page structure, text binding, and boot watchdog.
- `text.js` contains all user-facing strings and text templates.
- `styles.css` contains the responsive UI and compact mobile layout.
- `game-core.js` contains state, input, physics, stage teleporting, double jump, and dog-follow logic.
- `game-world.js` contains pixel-art landmarks and world scenery.
- `game-render.js` contains characters, themed enemies, effects, and the animation loop.
- `tests/game.test.mjs` boots the scripts inside a lightweight DOM and canvas harness.
- `tests/text-config.test.mjs` protects the centralized text configuration and mobile sizing.
- `.github/workflows/test.yml` runs the test suite in CI.

The game exposes a frozen `window.__SIDE_SCROLLING_LIFE__` test interface. It is used for deterministic smoke tests and is not required for normal gameplay.
