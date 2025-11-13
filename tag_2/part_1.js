import fs from 'node:fs';

function separate_input(input){
    let input_per_line = input.split("\n");
    //entfernt Leerzeile am Ende
    if(input_per_line[input_per_line.length-1] == ""){
        input_per_line.splice(input_per_line.length-1, 1);
    }
    for(let i=0; i<input_per_line.length;i++){
        input_per_line[i] = input_per_line[i].split("x");
        for(let j=0; j<3; j++){
            input_per_line[i][j] = Number(input_per_line[i][j]);
        }
    }
    return input_per_line;
}

function print_input(input){
    for(let i=0; i<input.length;i++){
        console.log("%ix%ix%i", input[i][0], input[i][1], input[i][2]);
    }
}

//l x w x h
function calculate_paper(size){
    let side_lxw = size[0]*size[1];
    let side_wxh = size[1]*size[2];
    let side_hxl = size[2]*size[0];

    //kleinste Seite ermitteln
    let smallest_side = side_lxw;
    if(side_wxh < smallest_side){
        smallest_side = side_wxh;
    }
    if(side_hxl < smallest_side){
        smallest_side = side_hxl;
    }

    //console.log("%ix%ix%i - %i, %i, %i\n kleinste Seite: %i", size[0], size[1], size[2], side_lxw, side_wxh, side_hxl, smallest_side);

    return 2*side_lxw + 2*side_wxh + 2*side_hxl + smallest_side;
}

let input = fs.readFileSync("./tag_2/input.txt", 'utf8');
input = separate_input(input);
//print_input(input);

let result = 0;
for(let i=0; i<input.length; i++){
    result += calculate_paper(input[i]);
}

console.log(result);