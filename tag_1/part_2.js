import fs from 'node:fs';

let text = fs.readFileSync("./tag_1/input.txt", 'utf8');
let floor = 0;
const basement = -1;
for(let i=0; i<text.length; i++){
    if(text[i] == "("){
        floor += 1;
    }
    else{
        floor -= 1;
    }
    if(floor == -1){
        console.log(i+1);
        process.exit(0);
    }
}