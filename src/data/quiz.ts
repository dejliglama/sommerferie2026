export interface QuizQuestion {
  id: string;
  emoji: string;
  question: string;
  options: [string, string, string];
  correctIndex: 0 | 1 | 2;
}

// 20 spørgsmål bygget på de samme fun facts, I møder rundt om på ruten.
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "kronborg",
    emoji: "👻",
    question: "Hvad hedder slottet i Helsingør, som Shakespeare skrev om i \"Hamlet\"?",
    options: ["Kronborg Slot", "Amalienborg", "Rundetårn"],
    correctIndex: 0,
  },
  {
    id: "holger",
    emoji: "🗿",
    question: "Hvem sover angiveligt dybt under Kronborg og vågner, hvis Danmark er i fare?",
    options: ["H.C. Andersen", "Holger Danske", "Nissen Pyrus"],
    correctIndex: 1,
  },
  {
    id: "femern",
    emoji: "🚇",
    question: "Hvor lang bliver Femernbælt-tunnelen, som bygges der hvor I sejler med færgen?",
    options: ["5 km", "50 km", "18 km"],
    correctIndex: 2,
  },
  {
    id: "vogelflug",
    emoji: "🐦",
    question: "Hvad betyder ruten \"Vogelfluglinie\" på dansk?",
    options: ["Fugleflugtslinjen", "Den lange vej", "Solskinsvejen"],
    correctIndex: 0,
  },
  {
    id: "wunderland",
    emoji: "🚂",
    question: "Hvad hedder verdens største modeljernbane, tæt på ruten ved Hamborg?",
    options: ["Legoland", "Tivoli", "Miniatur Wunderland"],
    correctIndex: 2,
  },
  {
    id: "slotte",
    emoji: "🏰",
    question: "Cirka hvor mange slotte og borge har Tyskland?",
    options: ["Over 25.000", "Over 100", "Over 1.000"],
    correctIndex: 0,
  },
  {
    id: "sababurg",
    emoji: "🌹",
    question: "Hvad kaldes \"Tornerose-slottet\", der ligger tæt på Kassel?",
    options: ["Neuschwanstein", "Sababurg", "Frankenstein Slot"],
    correctIndex: 1,
  },
  {
    id: "grimm",
    emoji: "📖",
    question: "Hvilke brødre skrev eventyrene, I kører forbi på \"Den Tyske Eventyrvej\"?",
    options: ["Wright-brødrene", "Mario-brødrene", "Grimm-brødrene"],
    correctIndex: 2,
  },
  {
    id: "dukkehuse",
    emoji: "🏠",
    question: "Hvor mange dukkehuse er der i museet i Ellwangen?",
    options: ["5", "50", "500"],
    correctIndex: 1,
  },
  {
    id: "ulm",
    emoji: "⛪",
    question: "Hvor mange trin er der op til toppen af Ulmer Münster (verdens næsthøjeste kirketårn)?",
    options: ["100", "2.000", "768"],
    correctIndex: 2,
  },
  {
    id: "hohenems-kaffe",
    emoji: "☕",
    question: "Hvad åbnede i Hohenems i 1797 — det første i hele regionen?",
    options: ["Et kaffehus", "En skole", "En bro"],
    correctIndex: 0,
  },
  {
    id: "chur-alder",
    emoji: "🦴",
    question: "Hvor mange år har der cirka boet mennesker i Chur, Schweiz' ældste by?",
    options: ["Over 1.000 år", "Over 100 år", "Over 13.000 år"],
    correctIndex: 2,
  },
  {
    id: "viamala-navn",
    emoji: "😱",
    question: "Hvad betyder navnet \"Viamala\"?",
    options: ["Den onde vej", "Den smukke vej", "Den korte vej"],
    correctIndex: 0,
  },
  {
    id: "viamala-trin",
    emoji: "🪨",
    question: "Hvor mange trappetrin går I ned i Viamala-kløften?",
    options: ["50", "359", "1.000"],
    correctIndex: 1,
  },
  {
    id: "sanbernardino-hoejde",
    emoji: "⛰️",
    question: "Hvor højt oppe ligger San Bernardino-passet?",
    options: ["500 meter", "2.066 meter", "5.000 meter"],
    correctIndex: 1,
  },
  {
    id: "sanbernardino-sving",
    emoji: "🌀",
    question: "Hvor mange hårnålesving har den gamle vej over San Bernardino-passet?",
    options: ["Under 5", "Over 200", "Over 40"],
    correctIndex: 2,
  },
  {
    id: "lagomaggiore-navn",
    emoji: "🍦",
    question: "Hvad hedder søen, I får is ved, lige før I når Stresa?",
    options: ["Gardasøen", "Lago Maggiore", "Comosøen"],
    correctIndex: 1,
  },
  {
    id: "gelato",
    emoji: "🍨",
    question: "Hvad betyder \"gelato\" på italiensk?",
    options: ["Kage", "Pizza", "Is"],
    correctIndex: 2,
  },
  {
    id: "isolabella",
    emoji: "🏝️",
    question: "Hvad hedder øen med en kæmpe have formet som en bryllupskage, lige ved Stresa?",
    options: ["Isola Bella", "Isola Grande", "Isola Rossa"],
    correctIndex: 0,
  },
  {
    id: "napoleon",
    emoji: "👑",
    question: "Hvilken berømt person har besøgt haven på Isola Bella?",
    options: ["Albert Einstein", "Napoleon", "Dronning Margrethe"],
    correctIndex: 1,
  },
];
