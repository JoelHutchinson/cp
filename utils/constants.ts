export const PUZZLE_THEME_GROUPS = [
  {
    label: "Mating Patterns",
    themes: [
      { value: "anastasiaMate", label: "Anastasia's Mate" },
      { value: "arabianMate", label: "Arabian Mate" },
      { value: "backRankMate", label: "Back Rank Mate" },
      { value: "bodenMate", label: "Boden's Mate" },
      { value: "doubleBishopMate", label: "Double Bishop Mate" },
      { value: "dovetailMate", label: "Dovetail Mate" },
      { value: "hookMate", label: "Hook Mate" },
      { value: "mate", label: "Mate" },
      { value: "mateIn1", label: "Mate in 1" },
      { value: "mateIn2", label: "Mate in 2" },
      { value: "mateIn3", label: "Mate in 3" },
      { value: "mateIn4", label: "Mate in 4" },
      { value: "mateIn5", label: "Mate in 5" },
      { value: "smotheredMate", label: "Smothered Mate" },
    ],
  },
  {
    label: "Endgame",
    themes: [
      { value: "bishopEndgame", label: "Bishop Endgame" },
      { value: "knightEndgame", label: "Knight Endgame" },
      { value: "pawnEndgame", label: "Pawn Endgame" },
      { value: "queenEndgame", label: "Queen Endgame" },
      { value: "queenRookEndgame", label: "Queen and Rook Endgame" },
      { value: "rookEndgame", label: "Rook Endgame" },
      { value: "endgame", label: "Endgame" },
    ],
  },
  {
    label: "Tactical Motifs",
    themes: [
      { value: "attraction", label: "Attraction" },
      { value: "capturingDefender", label: "Capturing the Defender" },
      { value: "clearance", label: "Clearance" },
      { value: "deflection", label: "Deflection" },
      { value: "discoveredAttack", label: "Discovered Attack" },
      { value: "doubleCheck", label: "Double Check" },
      { value: "fork", label: "Fork" },
      { value: "interference", label: "Interference" },
      { value: "intermezzo", label: "Intermezzo" },
      { value: "pin", label: "Pin" },
      { value: "promotion", label: "Promotion" },
      { value: "quietMove", label: "Quiet Move" },
      { value: "sacrifice", label: "Sacrifice" },
      { value: "skewer", label: "Skewer" },
      { value: "trappedPiece", label: "Trapped Piece" },
      { value: "underPromotion", label: "Underpromotion" },
      { value: "xRayAttack", label: "X-Ray Attack" },
      { value: "zugzwang", label: "Zugzwang" },
      { value: "enPassant", label: "En Passant" },
      { value: "hangingPiece", label: "Hanging Piece" },
    ],
  },
  {
    label: "Game Phase",
    themes: [
      { value: "opening", label: "Opening" },
      { value: "middlegame", label: "Middlegame" },
      { value: "endgame", label: "Endgame" },
    ],
  },
  {
    label: "Attack & Defense",
    themes: [
      { value: "attackingF2F7", label: "Attack on f2/f7" },
      { value: "kingsideAttack", label: "Kingside Attack" },
      { value: "queensideAttack", label: "Queenside Attack" },
      { value: "defensiveMove", label: "Defensive Move" },
      { value: "exposedKing", label: "Exposed King" },
      { value: "castling", label: "Castling" },
    ],
  },
  {
    label: "Puzzle Length",
    themes: [
      { value: "oneMove", label: "One Move" },
      { value: "short", label: "Short" },
      { value: "long", label: "Long" },
      { value: "veryLong", label: "Very Long" },
    ],
  },
  {
    label: "Advantage & Evaluation",
    themes: [
      { value: "advantage", label: "Advantage" },
      { value: "crushing", label: "Crushing" },
      { value: "equality", label: "Equality" },
    ],
  },
  {
    label: "Special Games",
    themes: [
      { value: "master", label: "Master Game" },
      { value: "masterVsMaster", label: "Master vs Master" },
      { value: "superGM", label: "Super GM Game" },
    ],
  },
  {
    label: "Other",
    themes: [{ value: "advancedPawn", label: "Advanced Pawn" }],
  },
];

export const PUZZLE_THEMES = PUZZLE_THEME_GROUPS.flatMap(
  (group) => group.themes
);
