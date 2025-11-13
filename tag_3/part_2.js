import fs from 'node:fs';

let input = fs.readFileSync("./tag_3/input.txt", 'utf8');

let present = 1;
let x = 0;
let y = 0;

let santa = [0,0];
let robot = [0,0];

//Liste um bereits besuchte Häuser zu später abrufen zukönnen
let visited = ["(0,0)"];
for(let i=0; i<input.length; i++){

    if(i%2 == 0){
        x = santa[0];
        y = santa[1];
    }
    else{
        x = robot[0];
        y = robot[1];
    }

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

    if(i%2 == 0){
        santa = [x,y];
    }
    else{
        robot = [x,y];
    }
}
console.log(santa);
console.log(robot);
console.log(present);
