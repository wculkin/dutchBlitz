const adjectivesAndVerbs: string[] = [
  "Swift", "Clever", "Brave", "Fierce", "Mighty", "Silent", "Thunderous", "Gliding",
  "Running", "Soaring", "Dashing", "Stealthy", "Roaring", "Sly", "Blazing",
  "Galloping", "Leaping", "Shadowy", "Nimble", "Pouncing", "Bounding", "Raging",
  "Cunning", "Lurking", "Charging", "Daring", "Majestic", "Fearless", "Vigilant",
  "Whispering", "Striking",
];

// Array of animal names
const animals: string[] = [
  "Falcon", "Wolf", "Tiger", "Eagle", "Panther", "Shark", "Bear", "Lion", "Hawk",
  "Dragon", "Leopard", "Cheetah", "Viper", "Fox", "Owl", "Raven", "Cobra",
  "Puma", "Jaguar", "Raptor", "Griffin", "Phoenix", "Bison", "Rhino",
  "Buffalo", "Stallion", "Mustang", "Condor", "Lynx", "Cougar", "Wolverine",
  "Hyena", "Gorilla", "Crocodile", "Komodo", "Scorpion", "Mongoose",
  "Panther", "Jackal",
];

export function generateRandomUsername(): string {
  const adjectiveOrVerb = adjectivesAndVerbs[getRandomInt(0, adjectivesAndVerbs.length - 1)];
  const animal = animals[getRandomInt(0, animals.length - 1)];
  return `${adjectiveOrVerb} ${animal}`;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

