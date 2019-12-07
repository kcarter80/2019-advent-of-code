// start: 8:45a
// * @ 9:53;

class Node {
  constructor(name) {
    this.name = name;
    this.child = undefined;
    this.parent = undefined;
  }
  // Getter
  get numOrbits() {
    let i = 0;
    let currentNode = this;
    while (currentNode.parent) {
      i += 1;
      currentNode = currentNode.parent;
    }
    return i;
  }
  // Method
  calcOrbits() {
    if (this.name == 'COM') {
      return 0;
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
  let totalOrbits = 0;
  for (let i = 0; i < orbits.length; i++) {
    totalOrbits += orbits[i].numOrbits;
  }
  console.log(totalOrbits);
});