// start: 8:45a
// * @ 9:53a;
// ** @ 10:40a;

class Node {
  constructor(name) {
    this.name = name;
    this.child = undefined;
    this.parent = undefined;
  }
  get numOrbits() {
    let i = 0;
    let currentNode = this;
    while (currentNode.parent) {
      i += 1;
      currentNode = currentNode.parent;
    }
    return i;
  }
  get parents() {
    let parents = []
    let currentParent = this.parent;
    while (currentParent) {
      parents.push(currentParent);
      currentParent = currentParent.parent;
    }
    return parents;
  }

  // Method
  distanceFrom(node) {
    let thisParents = this.parents
    let nodeParents = node.parents
    for (let i = 0; i < thisParents.length; i++) {
      for (let j = 0; j < nodeParents.length; j++) {
        if (thisParents[i] == nodeParents[j]) {
          return i+j;
        }
      }
    }
  }
}

const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({
  input: fs.createReadStream('./input-1'),
});

let orbits = new Array;

readInterface.on('line', function(line) {
  let orbit = line.split(')');
  let parent = orbits.find(element => element.name == orbit[0]);
  let child = orbits.find(element => element.name == orbit[1]);
  if (!parent) {
    parent = new Node(orbit[0]);
    orbits.push(parent);
  }
  if (!child) {
    child = new Node(orbit[1]);
    orbits.push(child);
  }
  parent.child = child;
  child.parent = parent;
}).on('close', function() {
  let you, san;
  for (let i = 0; i < orbits.length; i++) {
    if (orbits[i].name == 'YOU') you = orbits[i];
    if (orbits[i].name == 'SAN') san = orbits[i];
  }
  console.log(you.distanceFrom(san));
});