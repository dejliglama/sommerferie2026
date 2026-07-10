export interface QuizOption {
  emoji: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: [QuizOption, QuizOption, QuizOption];
  correctIndex: 0 | 1 | 2;
}

// 40 spørgsmål bygget på de samme fun facts, I møder rundt om på ruten.
// Spørgsmålet selv har ikke noget ikon (det ville afsløre svaret for meget),
// men hver svarmulighed har sit eget, så det er nemt at gætte med selvom man
// ikke kan læse hele teksten endnu.
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "kronborg",
    question: "Hvad hedder slottet i Helsingør, som Shakespeare skrev om i \"Hamlet\"?",
    options: [
      { emoji: "🏰", text: "Kronborg Slot" },
      { emoji: "👑", text: "Amalienborg" },
      { emoji: "🗼", text: "Rundetårn" },
    ],
    correctIndex: 0,
  },
  {
    id: "shakespeare",
    question: "Hvilket berømt skuespil foregår på Kronborg Slot?",
    options: [
      { emoji: "👑", text: "Hamlet" },
      { emoji: "🐭", text: "Askepot" },
      { emoji: "🌹", text: "Tornerose" },
    ],
    correctIndex: 0,
  },
  {
    id: "femern",
    question: "Hvor lang bliver Femernbælt-tunnelen, som bygges der hvor I sejler med færgen?",
    options: [
      { emoji: "📏", text: "5 km" },
      { emoji: "📐", text: "50 km" },
      { emoji: "🚇", text: "18 km" },
    ],
    correctIndex: 2,
  },
  {
    id: "femern-dybde",
    question: "Hvor mange meter under havet kommer Femernbælt-tunnelen til at ligge?",
    options: [
      { emoji: "🤏", text: "4 meter" },
      { emoji: "🌊", text: "40 meter" },
      { emoji: "🏔️", text: "400 meter" },
    ],
    correctIndex: 1,
  },
  {
    id: "femern-lande",
    question: "Hvilke to lande forbinder Femernbælt-tunnelen?",
    options: [
      { emoji: "🇩🇰", text: "Danmark og Tyskland" },
      { emoji: "🇮🇹", text: "Italien og Schweiz" },
      { emoji: "🇦🇹", text: "Østrig og Tyskland" },
    ],
    correctIndex: 0,
  },
  {
    id: "faerge-transport",
    question: "Hvordan kommer familien fra Danmark til Tyskland?",
    options: [
      { emoji: "✈️", text: "Med fly" },
      { emoji: "⛴️", text: "Med færge" },
      { emoji: "🌉", text: "Over en bro" },
    ],
    correctIndex: 1,
  },
  {
    id: "faerge-varighed",
    question: "Hvor lang tid tager færgeturen fra Rødby til Puttgarden cirka?",
    options: [
      { emoji: "⚡", text: "5 minutter" },
      { emoji: "⏰", text: "45 minutter" },
      { emoji: "📆", text: "5 timer" },
    ],
    correctIndex: 1,
  },
  {
    id: "wunderland",
    question: "Hvad hedder verdens største modeljernbane, tæt på ruten ved Hamborg?",
    options: [
      { emoji: "🧱", text: "Legoland" },
      { emoji: "🎡", text: "Tivoli" },
      { emoji: "🚂", text: "Miniatur Wunderland" },
    ],
    correctIndex: 2,
  },
  {
    id: "wunderland-by",
    question: "I hvilken tysk by ligger Miniatur Wunderland?",
    options: [
      { emoji: "🏰", text: "Berlin" },
      { emoji: "⚓", text: "Hamborg" },
      { emoji: "🍺", text: "München" },
    ],
    correctIndex: 1,
  },
  {
    id: "wunderland-biler",
    question: "Hvor mange miniature-biler er der cirka i Miniatur Wunderland?",
    options: [
      { emoji: "🔟", text: "Ca. 10" },
      { emoji: "🚗", text: "Ca. 9.250" },
      { emoji: "🌍", text: "Ca. 1 million" },
    ],
    correctIndex: 1,
  },
  {
    id: "wunderland-traeer",
    question: "Hvor mange miniature-træer er der cirka i Miniatur Wunderland?",
    options: [
      { emoji: "🌱", text: "Ca. 100" },
      { emoji: "🌳", text: "Ca. 130.000" },
      { emoji: "🌲", text: "Ca. 1 million" },
    ],
    correctIndex: 1,
  },
  {
    id: "vogelflug-dyr",
    question: "Hvilke dyr har givet navn til ruten \"Vogelfluglinie\", I kører på?",
    options: [
      { emoji: "🐦", text: "Fugle" },
      { emoji: "🐟", text: "Fisk" },
      { emoji: "🦋", text: "Sommerfugle" },
    ],
    correctIndex: 0,
  },
  {
    id: "slotte",
    question: "Cirka hvor mange slotte og borge har Tyskland?",
    options: [
      { emoji: "🏰", text: "Over 25.000" },
      { emoji: "🏠", text: "Over 100" },
      { emoji: "🏯", text: "Over 1.000" },
    ],
    correctIndex: 0,
  },
  {
    id: "maerchenstrasse",
    question: "Hvad hedder den tyske vej, I kører langs, som følger eventyrenes spor?",
    options: [
      { emoji: "🐉", text: "Dragevejen" },
      { emoji: "📖", text: "Den Tyske Eventyrvej" },
      { emoji: "🍫", text: "Chokoladevejen" },
    ],
    correctIndex: 1,
  },
  {
    id: "dukkehuse",
    question: "Hvor mange dukkehuse er der i museet i Ellwangen?",
    options: [
      { emoji: "1️⃣", text: "5" },
      { emoji: "🏠", text: "50" },
      { emoji: "💯", text: "500" },
    ],
    correctIndex: 1,
  },
  {
    id: "ellwangen-figurer",
    question: "Hvor mange figurer er der i de kæmpe julekrybber i Ellwangens slot?",
    options: [
      { emoji: "🔟", text: "Over 10" },
      { emoji: "💯", text: "Over 100" },
      { emoji: "🌍", text: "Over 1 million" },
    ],
    correctIndex: 1,
  },
  {
    id: "ulm-taarn",
    question: "Hvad kan I se højt oppe over byen Ulm, som I kører forbi?",
    options: [
      { emoji: "⛪", text: "Et kæmpe kirketårn" },
      { emoji: "🎡", text: "Et pariserhjul" },
      { emoji: "🗽", text: "En kæmpe statue" },
    ],
    correctIndex: 0,
  },
  {
    id: "hohenems-land",
    question: "Hvilket land ligger Hohenems, hvor I spiser morgenmad, i?",
    options: [
      { emoji: "🇦🇹", text: "Østrig" },
      { emoji: "🇫🇷", text: "Frankrig" },
      { emoji: "🇪🇸", text: "Spanien" },
    ],
    correctIndex: 0,
  },
  {
    id: "chur-land",
    question: "Hvilket land ligger byen Chur i?",
    options: [
      { emoji: "🇨🇭", text: "Schweiz" },
      { emoji: "🇧🇪", text: "Belgien" },
      { emoji: "🇳🇱", text: "Holland" },
    ],
    correctIndex: 0,
  },
  {
    id: "chur-urban-golf",
    question: "Hvad kan familien spille i gaderne i Chur?",
    options: [
      { emoji: "⛳", text: "Urban Golf" },
      { emoji: "🏀", text: "Basketball" },
      { emoji: "🎳", text: "Bowling" },
    ],
    correctIndex: 0,
  },
  {
    id: "chur-gaestekort",
    question: "Hvad får familien gratis, når de tjekker ind på hotellet i Chur?",
    options: [
      { emoji: "🎫", text: "Et gæstekort med rabatter" },
      { emoji: "🍕", text: "Gratis pizza hver dag" },
      { emoji: "🚲", text: "En cykel de må beholde" },
    ],
    correctIndex: 0,
  },
  {
    id: "viamala-navn",
    question: "Hvad betyder navnet \"Viamala\"?",
    options: [
      { emoji: "😈", text: "Den onde vej" },
      { emoji: "🌸", text: "Den smukke vej" },
      { emoji: "📏", text: "Den korte vej" },
    ],
    correctIndex: 0,
  },
  {
    id: "viamala-trin",
    question: "Hvor mange trappetrin går I ned i Viamala-kløften?",
    options: [
      { emoji: "🔟", text: "50" },
      { emoji: "🪜", text: "359" },
      { emoji: "💯", text: "1.000" },
    ],
    correctIndex: 1,
  },
  {
    id: "viamala-hoejde",
    question: "Hvor høje er klippevæggene i Viamala-kløften helt oppe?",
    options: [
      { emoji: "🤏", text: "Op til 30 meter" },
      { emoji: "🏔️", text: "Op til 300 meter" },
      { emoji: "🚀", text: "Op til 3.000 meter" },
    ],
    correctIndex: 1,
  },
  {
    id: "thusis-opladning",
    question: "Hvad gør familien i Thusis, lige før de kører op over bjergpasset?",
    options: [
      { emoji: "🔋", text: "Lader bilen op" },
      { emoji: "🛌", text: "Sover til næste dag" },
      { emoji: "🎢", text: "Tager i forlystelsespark" },
    ],
    correctIndex: 0,
  },
  {
    id: "sanbernardino-hoejde",
    question: "Hvor højt oppe ligger San Bernardino-passet?",
    options: [
      { emoji: "🏠", text: "500 meter" },
      { emoji: "⛰️", text: "2.066 meter" },
      { emoji: "🚀", text: "5.000 meter" },
    ],
    correctIndex: 1,
  },
  {
    id: "sanbernardino-soe",
    question: "Hvad hedder bjergsøen, familien besøger på toppen af San Bernardino-passet?",
    options: [
      { emoji: "🏞️", text: "Lago Moesola" },
      { emoji: "🌊", text: "Gardasøen" },
      { emoji: "💧", text: "Genfersøen" },
    ],
    correctIndex: 0,
  },
  {
    id: "sanbernardino-frokost",
    question: "Hvor spiser familien frokost på toppen af San Bernardino-passet?",
    options: [
      { emoji: "🍽️", text: "På gæstgiveriet Ospizio San Bernardino" },
      { emoji: "🍔", text: "På en McDonald's" },
      { emoji: "🧺", text: "De har madpakker med hjemmefra" },
    ],
    correctIndex: 0,
  },
  {
    id: "lagomaggiore-navn",
    question: "Hvad hedder søen, I får is ved, lige før I når Stresa?",
    options: [
      { emoji: "🌊", text: "Gardasøen" },
      { emoji: "🍦", text: "Lago Maggiore" },
      { emoji: "💧", text: "Comosøen" },
    ],
    correctIndex: 1,
  },
  {
    id: "gelato",
    question: "Hvad betyder \"gelato\" på italiensk?",
    options: [
      { emoji: "🎂", text: "Kage" },
      { emoji: "🍕", text: "Pizza" },
      { emoji: "🍨", text: "Is" },
    ],
    correctIndex: 2,
  },
  {
    id: "isolabella-terrasser",
    question: "Hvor mange terrasser har den kæmpe have på Isola Bella?",
    options: [
      { emoji: "2️⃣", text: "2" },
      { emoji: "🔟", text: "10" },
      { emoji: "💯", text: "100" },
    ],
    correctIndex: 1,
  },
  {
    id: "isolabella-form",
    question: "Hvad ligner haven på Isola Bella, med sine mange terrasser?",
    options: [
      { emoji: "🎂", text: "En kæmpe bryllupskage" },
      { emoji: "🚢", text: "Et skib" },
      { emoji: "🐘", text: "En elefant" },
    ],
    correctIndex: 0,
  },
  {
    id: "stresa-land",
    question: "Hvilket land ligger Stresa, rejsens slutmål, i?",
    options: [
      { emoji: "🇮🇹", text: "Italien" },
      { emoji: "🇬🇷", text: "Grækenland" },
      { emoji: "🇪🇸", text: "Spanien" },
    ],
    correctIndex: 0,
  },
  {
    id: "bil-type",
    question: "Hvad slags bil kører familien i på hele turen?",
    options: [
      { emoji: "⚡", text: "En elbil" },
      { emoji: "⛽", text: "En benzinbil" },
      { emoji: "🐴", text: "En hestevogn" },
    ],
    correctIndex: 0,
  },
  {
    id: "antal-lande",
    question: "Hvor mange lande kører familien igennem på hele turen?",
    options: [
      { emoji: "3️⃣", text: "3 lande" },
      { emoji: "5️⃣", text: "5 lande" },
      { emoji: "🔟", text: "10 lande" },
    ],
    correctIndex: 1,
  },
  {
    id: "ikke-land",
    question: "Hvilket land kører familien IKKE igennem på turen?",
    options: [
      { emoji: "🇫🇷", text: "Frankrig" },
      { emoji: "🇮🇹", text: "Italien" },
      { emoji: "🇩🇪", text: "Tyskland" },
    ],
    correctIndex: 0,
  },
  {
    id: "afgangsdag",
    question: "Hvilken ugedag kører familien hjemmefra?",
    options: [
      { emoji: "🌞", text: "Fredag" },
      { emoji: "🌙", text: "Mandag" },
      { emoji: "🎉", text: "Søndag" },
    ],
    correctIndex: 0,
  },
  {
    id: "koereturens-laengde",
    question: "Hvor lang er hele køreturen fra Helsingør til Stresa cirka?",
    options: [
      { emoji: "🚲", text: "Ca. 100 km" },
      { emoji: "🚗", text: "Ca. 1.250 km" },
      { emoji: "🚀", text: "Ca. 10.000 km" },
    ],
    correctIndex: 1,
  },
  {
    id: "is-antal",
    question: "Hvis 1 is svarer til 1 km, hvor mange is skal bilen \"spise\" på hele turen?",
    options: [
      { emoji: "🍦", text: "Ca. 10 is" },
      { emoji: "🍨", text: "Ca. 1.250 is" },
      { emoji: "🍧", text: "Ca. 1 million is" },
    ],
    correctIndex: 1,
  },
  {
    id: "hjul-omdrejninger",
    question: "Cirka hvor mange gange drejer hvert hjul rundt på hele turen?",
    options: [
      { emoji: "💯", text: "Ca. 100 gange" },
      { emoji: "🔢", text: "Ca. 600.000 gange" },
      { emoji: "♾️", text: "Ca. 1 milliard gange" },
    ],
    correctIndex: 1,
  },
];
