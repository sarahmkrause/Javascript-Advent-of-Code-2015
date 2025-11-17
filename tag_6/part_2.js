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
        if(cmd[1] == "on"){
            mode = 1;
        }
        else{
            mode = -1;
        }
    }
    //console.log("(" + Number(coord_start[0]) + "," + Number(coord_start[1]) + ")\n(" + Number(coord_end[0]) + "," + Number(coord_end[1]) + ")");
    return [[[Number(coord_start[0]), Number(coord_start[1])],[Number(coord_end[0]), Number(coord_end[1])]], mode]
}

function create_lights(size){
    let lights = [];
    for(let i=0; i<size; i++){
        lights[i] = [];
        for(let j=0; j<size; j++){
            lights[i][j] = 0;
        }
    }
    return lights;
}

function operate_lights(mode, range, lights){
    for(let i=range[0][0]; i<range[1][0]+1; i++){
        for(let j=range[0][1]; j<range[1][1]+1; j++){
            lights[i][j] = Math.max(lights[i][j] + mode , 0);
        }
    }
    return lights;
}

function count_lights(lights){
    let size = lights.length;
    let result = 0;
    for(let i=0; i<size; i++){
        for(let j=0; j<size; j++){
            //console.log(lights[i][j])
            result += lights[i][j];
        }
    }
    return result;
}



let input = read_input("./tag_6/input.txt");

const size = 1000;

let lights = create_lights(size);

for(let i=0; i<input.length; i++){
    let cmd = sanitize_cmd(input[i]);
    //console.log(cmd);
    lights = operate_lights(cmd[1], cmd[0], lights)
    //console.log(count_lights(lights));
}
console.log(count_lights(lights));
