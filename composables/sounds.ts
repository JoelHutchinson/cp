// Sound effects for chess moves
export const useChessSounds = () => {
  const playSound = (soundName: string) => {
    if (typeof window === 'undefined') return;

    try {
      const audio = new Audio(`/sounds/${soundName}.mp3`);
      audio.volume = 0.3; // Set volume to 30%
      audio.play().catch(() => {
        // Silently fail if audio can't play (e.g., user hasn't interacted with page)
      });
    } catch (error) {
      // Silently fail if audio creation fails
    }
  };

  return {
    playMove: () => playSound('move'),
    playCapture: () => playSound('capture'),
    playCheck: () => playSound('check'),
    playCheckmate: () => playSound('checkmate'),
    playCorrect: () => playSound('correct'),
    playIncorrect: () => playSound('incorrect'),
    playPuzzleSolved: () => playSound('puzzle-solved'),
  };
};
