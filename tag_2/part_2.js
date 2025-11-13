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
function calculate_ribbon(size){
    let length_a = size[0];
    let length_b = 0;
    if(size[1] < length_a){
        length_b = length_a;
        length_a = size[1];
    }
    else{
        length_b = size[1];
    }

    if(size[2] < length_a){
        length_b = length_a;
        length_a = size[2];
    }
    else if(size[2] < length_b){
        length_b = size[2];
    }

    return 2*length_a + 2*length_b + size[0] * size[1] * size[2];
}

let input = fs.readFileSync("./tag_2/input.txt", 'utf8');
input = separate_input(input);
//print_input(input);

let result = 0;
for(let i=0; i<input.length; i++){
    result += calculate_ribbon(input[i]);
}

console.log(result);