const animal = require('./items/animal.json');
const artisan = require('./items/artisan.json');
const cooking = require('./items/cooking.json');
const fish = require('./items/fish.json');
const forage = require('./items/forage.json');
const fruit = require('./items/fruit.json');
const mineral = require('./items/minerals.json');
const vegetable = require('./items/vegetables.json');

const allItems = [
  ...animal.items,
  ...artisan.items,
  ...cooking.items,
  ...fish.items,
  ...forage.items,
  ...fruit.items,
  ...mineral.items,
  ...vegetable.items,
];

const numOfItemsMap = {
    0: -9, 1: -7, 2: -5, 3: -3, 4: -1, 5: 1, 6: 3, 7: 5, 8: 7, 9: 9
}
function getNumOfItemPoints(numItems) {
    return numOfItemsMap[numItems] || 0;
}

function getCategoryPoints(items) {
  const categories = new Set(items.map(item => item.category));
  return Math.min(categories.size * 5, 30);
}

function getQualityPoints(item, qualityType) {
  if (!item.quality || !item.quality[qualityType]) return 0;
  const value = item.quality[qualityType];
  return value;
}


function calculateGrangeScore(displayItems) {
  let score = 14;
  score += getNumOfItemPoints(displayItems.length);
  score += getCategoryPoints(displayItems);

  score += displayItems.reduce((sum, {item, quality}) => sum + getQualityPoints(item, quality), 0);

  return score;
}

const chosenItems = [
    { item: allItems.find(i => i.name === "Ancient Fruit" && i.type === "Tiller"), quality: "silver" },
    { item: allItems.find(i => i.name === "Salmonberry" && i.type === "TillerAndKnowledge"), quality: "iridium" },
    { item: allItems.find(i => i.name === "Starfruit" && i.type === "Base"), quality: "normal" },
]

const displayScore = calculateGrangeScore(chosenItems)
console.log(`Total Score: ${displayScore}`)
