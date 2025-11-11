import fs from 'node:fs';

let text = fs.readFileSync("./tag_1/input.txt", 'utf8');
let floor = 0;
for(let character of text){
    if(character == "("){
        floor += 1;
    }
    else{
        floor -= 1;
    }
}
//console.log(text);
console.log(floor);