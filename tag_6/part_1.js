import fs from 'node:fs';

function read_input(file){
    let input = fs.readFileSync(file, 'utf8');
    input = input.split("\n");

    //entfernt den Eintrag der durch die Leerzeile entstanden ist
    if(input[input.length-1] == ""){
        input.pop();
    }

    return input;
}

function sanitize_cmd(cmd){
    let coord_start;
    let coord_end;
    let mode;
    cmd = cmd.split(" ");
    if(cmd[0] == "toggle"){
        coord_start = cmd[1].split(",");
        coord_end = cmd[3].split(",");
        mode = 2;
    }
    else if(cmd[0] == "turn"){
        coord_start = cmd[2].split(",");
        coord_end = cmd[4].split(",");
        mode = Number(cmd[1] == "on");
    }
    return [[Number(coord_start[0]), Number(coord_start[1])],[Number(coord_end[0]), Number(coord_end[1])], mode]
}

function print_lights(lights){
    let log_lights = "";

    for(let i=0; i<lights.length+2; i++){
        log_lights += "-";
    }
    log_lights += "\n";

    for(let i=0; i<lights.length; i++){
        log_lights += "|";
        for(let j=0; j<lights.length; j++){
            if(lights[i][j]){
                log_lights += "█";
            }
            else{
                log_lights += " ";
            }
        }
        log_lights += "|\n";
    }

    for(let i=0; i<lights.length+2; i++){
        log_lights += "-";
    }
    log_lights += "\n";

    console.log(log_lights);
}


let input = read_input("./tag_6/example.txt");

const lights_size = 1000;
let lights = [];
for(let i=0; i<lights_size; i++){
    lights[i] = [];
    for(let j=0; j<lights_size; j++){
        lights[i][j] = false;
    }
}
//lights[1][1] = true;
print_lights(lights);

//new idea
let turned_on = [];
for(let i=0; i<lights_size; i++){
    turned_on[i] = [];
}

for(let i=0; i<input.length; i++){
    let cmd = sanitize_cmd(input[i]);
}