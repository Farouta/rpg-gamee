let xp = 0;
let health = 100;
let gold = 50;
let strength=1;
let agility=1;
let currentWeaponIndex = 0;
let fighting;
let monsterHealth;
let inventory = ["3sa"];


const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: '3sa', power: 5 },
  { name: 'sekinet lkoujina', power: 30 },
  { name: 'dhwafer el amira', power: 50 },
  { name: 'EL GRANDINO', power: 100 }
];
const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60
  },
  {
    name: "dragon",
    level: 20,
    health: 300
  }
]
const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"Store\"."
  },
  {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store."
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters."
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, run],
    text: "You are fighting a monster."
  },
  {
    name: "kill monster",
    "button text": ["Go to town square"],
    "button functions": [goTown],
    text: 'The monster screams "YAMMAA" as it dies. You gain xp and find gold.\n You sense something lingering in the darkness...'
  },
  {
    name: "lose",
    "button text": ["REPLAY?"],
    "button functions": [restart],
    text: "You die. &#x2620;"
  },
  { 
    name: "win", 
    "button text": ["REPLAY?"], 
    "button functions": [restart], 
    text: "Sa7a patron tbarkallah rba7t &#x1F389;" 
  }
];

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  if (location["button text"].length===1){
  button2.style.display="none"
  button3.style.display="none"
  button1.innerText = location["button text"][0];
  button1.onclick = location["button functions"][0];
  text.innerHTML = location.text;
}else{
  button2.style.display="inline"
  button3.style.display="inline"
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = 'The shopkeeper says:"3andekch dannous sadi9i"';
  }
}

function buyWeapon() {
  if (currentWeaponIndex < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeaponIndex++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeaponIndex].name;
      text.innerText = "You now have " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText =  'The shopkeeper gives you a smirk as he looks at your '+wepons[currentWeaponIndex]+' and affirms:"yzazikech eli 3andi?"';
    }
  } else {
    text.innerText = 'The shopkeeper looks at you annoyed:"kahaw 3ad heka ch3anna"';
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "bech tadhrabhom bidek?";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  setMonsterHealthBar(100)
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText += " You attack it with " + weapons[currentWeaponIndex].name + ".";
  monsterAttack();

  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeaponIndex].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText +=  "\n"+" You miss lol.";
  }

  monsterHealthText.innerText = monsterHealth;
  setMonsterHealthBar((monsterHealth*100)/monsters[fighting].health)
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .05 && inventory.length !== 1) {
    text.innerText += "\n" +inventory.pop() + " breaks.";
    currentWeaponIndex--;
  }
}
function monsterAttack(){
  health -= getMonsterAttackValue(monsters[fighting].level);
  healthText.innerText = health;
  if (health <= 0) {
    lose();
  }
}
function getMonsterAttackValue(level) {
  const hit = (level * 2) - (Math.floor(Math.random() * xp*0.9));
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .1 || health < 10;
}

function dodge() {
  if(Math.random()<0.1*agility){
    attack();
    text.innerText = "You dodge the attack from the " + monsters[fighting].name+" and counter-striked.";
}else{
  text.innerText="You failed to dodge"
  monsterAttack();

}
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);

}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeaponIndex = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  
  goTown();
}
function run(){
  if(Math.random()>0.2){
    goTown();
    text.innerText="You managed to escape. Now where to?"
  }else{
    text.innerText="The "+monsters[fighting].name+" blocked your escape!"
    monsterAttack();
  }
  
}



function setMonsterHealthBar(precent){
  document.documentElement.style.setProperty("--monsterHealthbar", String(precent)+"%");
  
}
