import fs from 'node:fs';

let input = fs.readFileSync("./tag_3/input.txt", 'utf8');

let present = 1;
let x = 0;
let y = 0;

//Liste um bereits besuchte Häuser zu später abrufen zukönnen
let visited = ["(0,0)"];
for(let i=0; i<input.length; i++){
    switch(input[i]){
        case "<":
            x--;
            break;
        case ">":
            x++;
            break;
        case "v":
            y--;
            break;
        case "^":
            y++;
            break;
        default:
            continue;
    }

    let coordinates = "(" + x + "," + y + ")";
    if(visited.indexOf(coordinates) == -1){
        visited.push(coordinates);
        present++;
    }
    //console.log("(%i,%i) - Presents: %i", x, y, present);
}

console.log(present);
