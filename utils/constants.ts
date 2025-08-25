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

export const AMAZON_BOOKS = [
  {
    title: "The Woodpecker Method",
    author: "Axel Smith & Hans Tikkanen",
    description:
      "The book that this application is based on! Try the original set of high-quality puzzles that Tikkanen trained on to achieve three GM norms with this paperback.",
    image: "https://covers.openlibrary.org/b/isbn/1784830542-L.jpg",
    link: "https://amzn.to/3JnABjm",
  },
  {
    title: "The Woodpecker Method 2",
    author: "Axel Smith",
    description:
      "Building upon the original Woodpecker Method, this sequel shifts focus from tactics to positional chess. Exercises cover pawn structures, piece activity, and weak squares.",
    image: "woodpecker-method-2-cover.png",
    link: "https://amzn.to/417McZS",
  },
  {
    title: "The Art of Attack in Chess",
    author: "Vladimir Vukovic",
    description:
      "A classic work focusing on attacking strategies and sacrifices in chess.",
    image: "https://covers.openlibrary.org/b/isbn/1857444000-L.jpg",
    link: "https://amzn.to/418zYjB",
  },
  {
    title: "Learn Chess the Right Way: Must-Know Checkmates",
    author: "Susan Polgar",
    description:
      "The first volume in a five-book puzzle series aimed at intermediate players, focusing on essential checkmate patterns.",
    image: "https://covers.openlibrary.org/b/isbn/1941270212-L.jpg",
    link: "https://amzn.to/4mF6ZwE",
  },
  {
    title: "Chess Scorebook Journal",
    author: "Joel Hutchinson",
    description:
      "Organise Your Chess Tournament Journey with Detailed Scoresheets. The combination of its functional scoresheets and premium matte cover makes an ideal companion for tournament players.",
    image: "chess-scorebook-journal-green-gold-cover.jpg",
    link: "https://amzn.to/4mF6ZwE",
  },
  {
    title: "Chessnut Air",
    author: "Chessnut",
    description:
      "A sleek, lightweight electronic chessboard with app integration for online and offline play. Perfect for portable training and competitive games.",
    image: "chessnut-air.jpg",
    link: "https://amzn.to/4mvZdor",
  },
  {
    title: "DGT Centaur",
    author: "Digital Game Technology",
    description:
      "An adaptive electronic chessboard that adjusts its strength to your level, offering a natural and enjoyable over-the-board experience.",
    image: "dgt-centaur.jpg",
    link: "https://amzn.to/4oOTprI",
  },
];

// TODO: Add these

/*
  {
    title: "Learn Chess the Right Way: Book 2 – Essential Tactics",
    author: "Susan Polgar",
    description:
      "The second volume in the series, covering fundamental tactical motifs and exercises.",
    image: "https://covers.openlibrary.org/b/isbn/1941270220-L.jpg",
    link: "https://www.amazon.com/dp/1941270220?tag=your-affiliate-id",
  },
  {
    title: "Learn Chess the Right Way: Book 3 – Winning Material",
    author: "Susan Polgar",
    description:
      "The third volume focusing on techniques for gaining material advantage in games.",
    image: "https://covers.openlibrary.org/b/isbn/1941270239-L.jpg",
    link: "https://www.amazon.com/dp/1941270239?tag=your-affiliate-id",
  },
  {
    title: "Learn Chess the Right Way: Book 4 – Mastering the Endgame",
    author: "Susan Polgar",
    description:
      "The fourth volume dedicated to endgame strategies and techniques.",
    image: "https://covers.openlibrary.org/b/isbn/1941270247-L.jpg",
    link: "https://www.amazon.com/dp/1941270247?tag=your-affiliate-id",
  },
  {
    title: "Learn Chess the Right Way: Book 5 – Finding Winning Moves",
    author: "Susan Polgar",
    description:
      "The fifth volume focusing on recognizing and executing decisive moves.",
    image: "https://covers.openlibrary.org/b/isbn/1941270662-L.jpg",
    link: "https://www.amazon.com/dp/1941270662?tag=your-affiliate-id",
  },
  {
    title: "Chess Tactics for the Tournament Player",
    author: "Lev Alburt & Sam Palatnik",
    description:
      "A comprehensive guide to chess tactics aimed at players rated 1200–2000.",
    image: "https://covers.openlibrary.org/b/isbn/1889323020-L.jpg",
    link: "https://www.amazon.com/dp/1889323020?tag=your-affiliate-id",
  },
  {
    title: "The Art of Sacrifice in Chess",
    author: "Rudolf Spielmann",
    description:
      "An in-depth look at the art of sacrificing material for positional advantage.",
    image: "https://covers.openlibrary.org/b/isbn/1936490781-L.jpg",
    link: "https://www.amazon.com/dp/1936490781?tag=your-affiliate-id",
  },
  {
    title: "Combinative Motifs",
    author: "Maxim Blokh",
    description:
      "A collection of over 1,400 exercises focusing on combinational tactics.",
    image: "https://covers.openlibrary.org/b/isbn/1857444000-L.jpg",
    link: "https://www.amazon.com/dp/1857444000?tag=your-affiliate-id",
  },
  {
    title: "Excelling at Chess Calculation",
    author: "Jacob Aagaard",
    description:
      "A guide to improving calculation skills and tactical awareness in chess.",
    image: "https://covers.openlibrary.org/b/isbn/1857443608-L.jpg",
    link: "https://www.amazon.com/dp/1857443608?tag=your-affiliate-id",
  },
  {
    title: "Perfect Your Chess",
    author: "Andrei Volokitin & Vladimir Grabinsky",
    description:
      "A collection of 369 positions designed to improve tactical vision and decision-making.",
    image: "https://covers.openlibrary.org/b/isbn/1915328063-L.jpg",
    link: "https://www.amazon.com/dp/1915328063?tag=your-affiliate-id",
  },
*/
