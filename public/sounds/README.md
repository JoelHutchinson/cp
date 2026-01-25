# Chess Sound Effects

This directory should contain the following sound files in MP3 format:

- `move.mp3` - Sound played when a piece moves (regular move)
- `capture.mp3` - Sound played when a piece captures another piece
- `check.mp3` - Sound played when a check occurs (optional, not currently used)
- `checkmate.mp3` - Sound played when checkmate occurs (optional, not currently used)
- `correct.mp3` - Sound played when a correct move is made in a puzzle
- `incorrect.mp3` - Sound played when an incorrect move is made in a puzzle
- `puzzle-solved.mp3` - Sound played when a puzzle is successfully solved

## Recommended Sources

You can find free chess sound effects at:
- [Freesound.org](https://freesound.org) - Search for "chess move", "chess capture", etc.
- [Zapsplat](https://www.zapsplat.com) - Free sound effects library
- [OpenGameArt](https://opengameart.org) - Free game assets

## Sound Specifications

- Format: MP3
- Recommended duration: 0.1-0.5 seconds for move/capture sounds, 0.5-1.5 seconds for feedback sounds
- Volume: Will be set to 30% in code, so sounds can be at normal levels

## Note

If sound files are not present, the application will continue to work normally - sounds will simply not play. The code handles missing sound files gracefully.
