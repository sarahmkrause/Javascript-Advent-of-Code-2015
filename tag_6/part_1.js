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

function pad_32bit(num, isHex){
    let size = 32;
    let prefix = "0b";
    let padded = num.toString(2);
    if(isHex){
        size = 8;
        prefix = "0x";
        padded = num.toString(16);
    }
    while(padded.length <= size){
        padded = "0" + padded;
    }
    return prefix + padded;
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
    console.log("(" + Number(coord_start[0]) + "," + Number(coord_start[1]) + ")\n(" + Number(coord_end[0]) + "," + Number(coord_end[1]) + ")");
    return [[[Number(coord_start[0]), Number(coord_start[1])],[Number(coord_end[0]), Number(coord_end[1])]], mode]
}

function findIndexOfColumn(column, turned_on){
    for(let i=0; i<turned_on.length; i++){
        if(turned_on[i][0] == column){
            return i;
        }
    }
    return -1;
}

//fügt eine spalte hinzu
//existierende spalten werden übersprungen
function add_new_column(column, size, turned_on){
    let init_row = [];
    for(let i=0; i<size; i++){
        init_row[i] = 0;
    }
    //console.log(column + " - " + init_row);
    for(let i=0; i<turned_on.length-1; i++){
        if(turned_on[i][0] < column && turned_on[i+1][0] > column){
            turned_on.splice(i+1, 0, [column, init_row]);
            //console.log("splice: " + turned_on);
            return turned_on, i+1;
        }
    }

    if(turned_on.length == 0 || turned_on[0][0] > column){
        turned_on.splice(0, 0, [column, init_row]);
        //console.log("first: " + turned_on);
        return turned_on, 0;
    }
    else if(turned_on[turned_on.length-1][0] < column){
        turned_on.push([column, init_row]);
        //console.log("push: " + turned_on);
        return turned_on, turned_on.length-1;
    }

    return turned_on, -1;
}

function convertToBinary(range, size, chunk_size){
    let chunks = [];
    let first_chunk = Math.floor(range[0][0]/chunk_size);
    let last_chunk = Math.floor(range[1][0]/chunk_size);
    //console.log("First Chunk: " + first_chunk);
    //console.log("Last Chunk: " + last_chunk);
    

    const full_chunk = 0xFFFFFFFF;
    //console.log(full_chunk.toString(16));

    for(let i=0; i<size; i++){
        if(i == first_chunk && i == last_chunk){
            chunks[i] = ((full_chunk << range[0][0])) >>> 0 & (full_chunk >>> range[1][0]);
        }
        else if(i == first_chunk){
            chunks[i] = (full_chunk << range[0][0]) >>> 0; //>>> 0 verhidert dass negativ zahlen entstehen
        }
        else if(i == last_chunk){
            chunks[i] = full_chunk >>> range[1][0];
        }
        else if(i > first_chunk && i < last_chunk){
            chunks[i] = full_chunk;
        }
        else{
            chunks[i] = 0x00000000;
        }
        console.log("Chunk: " + pad_32bit(chunks[i], false));
    }
    return chunks;
}

//Input: [[x1,y1],[x2,y2]]
function operate_lights(range, mode, size, chunk_size, turned_on){
    let column_index;

    let chunks = convertToBinary(range, size, chunk_size);

    for(let i=range[0][1]; i<range[1][1]; i++){
        column_index = findIndexOfColumn(i, turned_on);
        if(column_index == -1){
            turned_on, column_index = add_new_column(i, size, turned_on);
            //console.log("Index: ", column_index);
            //console.log("Array: ", turned_on[column_index][1].join());
        }

        //operation

        for(let j=0; j<size; j++){
            //console.log("Chunk: " + chunks[j]);
            if(mode == 0){
                chunks[j] = ~chunks[j];
                turned_on[column_index][1][j] = chunks[j] & turned_on[column_index][1][j];
            }
            else if(mode == 1){
                turned_on[column_index][1][j] = chunks[j] | turned_on[column_index][1][j];
            }
            else if(mode == 2){
                turned_on[column_index][1][j] = chunks[j] ^ turned_on[column_index][1][j];
            }
            //console.log("New Value: " + turned_on[column_index][1][j]);
        }
    }

    return turned_on;
}

function print_turned_on(turned_on, isHex){
    let output = "================\n";
    for(let i=0; i<turned_on.length; i++){
        output += "[ ";
        for(let j=0; j<turned_on[i][1].length-1; j++){
            output += pad_32bit(turned_on[i][1][j], isHex);
            output += ", ";
        }
        output += pad_32bit(turned_on[i][1][turned_on[i][1].length-1], isHex);
        output += " ]\n";
    }
    output += "================\n";
    console.log(output);
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

const size = 64;
const chunk_size = 32; //bit operation nutzen 32 bit integer

//new idea
let turned_on = [];

for(let i=0; i<input.length; i++){
    let cmd = sanitize_cmd(input[i]);
    console.log(cmd);
    turned_on = operate_lights(cmd[0], cmd[1], size/chunk_size, chunk_size, turned_on);
    //console.log(turned_on);
    print_turned_on(turned_on, false);
}

//console.log(convertToBinary([[8,0],[48,0]], size/chunk_size, chunk_size))