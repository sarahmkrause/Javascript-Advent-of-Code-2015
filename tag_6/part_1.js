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
    while(padded.length < size){
        padded = "0" + padded;
    }
    return prefix + padded;
}

function bitshift_left(num, shift){
    if(shift == 32){
        return (num << 31 << 1) >>> 0;
    }
    return (num << shift) >>> 0;
}

function bitshift_right(num, shift){
    if(shift == 32){
        return num >>> 31 >>> 1;
    }
    return num >>> shift;
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
    //console.log("(" + Number(coord_start[0]) + "," + Number(coord_start[1]) + ")\n(" + Number(coord_end[0]) + "," + Number(coord_end[1]) + ")");
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
    let first_chunk = Math.floor(range[0][0] / chunk_size);
    let last_chunk = Math.floor(range[1][0] / chunk_size);
    let first_chunk_index = range[0][0] % chunk_size;
    let last_chunk_index = chunk_size - ((range[1][0] % chunk_size) + 1);
    //console.log("First Chunk: " + first_chunk);
    //console.log("Last Chunk: " + last_chunk);
    

    const full_chunk = 0xFFFFFFFF;
    //console.log(full_chunk.toString(16));

    for(let i=0; i<size; i++){
        if(i == first_chunk && i == last_chunk){
            chunks[i] = bitshift_right(full_chunk, first_chunk_index) & bitshift_left(full_chunk, last_chunk_index);
            //console.log(">> <<");
        }
        else if(i == first_chunk){
            chunks[i] = bitshift_right(full_chunk, first_chunk_index);
            //console.log("<<");
        }
        else if(i == last_chunk){
            chunks[i] = bitshift_left(full_chunk, last_chunk_index);
            //console.log(">>");
        }
        else if(i > first_chunk && i < last_chunk){
            chunks[i] = full_chunk;
            //console.log("full");
        }
        else{
            chunks[i] = 0x00000000;
            //console.log("empty");
        }
        //console.log("Chunk cmd: " + pad_32bit(chunks[i], false));
    }
    return chunks;
}

//Input: [[x1,y1],[x2,y2]]
function operate_lights(range, mode, field_size, chunk_size, turned_on){
    let column_index;

    let size = Math.ceil(field_size/chunk_size);
    let mask = 0xFFFFFFFF;
    if(field_size % chunk_size != 0){
        mask = bitshift_left(mask, chunk_size - (field_size%chunk_size));
    }

    let chunks = convertToBinary(range, size, chunk_size);

    for(let i=range[0][1]; i<range[1][1]+1; i++){
        column_index = findIndexOfColumn(i, turned_on);
        if(column_index == -1){
            turned_on, column_index = add_new_column(i, size, turned_on);
            //console.log("Index: ", column_index);
            //console.log("Array: ", turned_on[column_index][1].join());
        }

        //console.log("Spalte: " + column_index);

        //operation

        for(let j=0; j<size; j++){
            //console.log("Old Chunk: " + pad_32bit(turned_on[column_index][1][j], false));
            if(mode == 0){
                turned_on[column_index][1][j] = (~chunks[j] & turned_on[column_index][1][j]) >>> 0;
                //console.log("turn off");
            }
            else if(mode == 1){
                turned_on[column_index][1][j] = (chunks[j] | turned_on[column_index][1][j]) >>> 0;
                //console.log("turn on");
            }
            else if(mode == 2){
                turned_on[column_index][1][j] = (chunks[j] ^ turned_on[column_index][1][j]) >>> 0;
                //console.log("toggle");
            }
            //console.log("New Chunk: " + pad_32bit(turned_on[column_index][1][j], false));
        }
        turned_on[column_index][1][size-1] = (mask & turned_on[column_index][1][size-1]) >>> 0;

        let empty = true;
        for(let j=0; j<size; j++){
            //console.log(turned_on[column_index][1][j]);
            if(turned_on[column_index][1][j] != 0 && empty){
                empty = false;
            }
        }
        //console.log(empty.toString());
        if(empty){
            turned_on.splice(column_index, 1);
        }
    }

    return turned_on;
}

function print_turned_on(turned_on, isHex){
    let output = "================\n";
    output += "Length: ";
    output += turned_on.length;
    output += "\n";
    for(let i=0; i<turned_on.length; i++){
        output += "[ (";
        output += turned_on[i][0];
        output += " - ";
        output += turned_on[i][1].length;
        output += ") ";
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

function count_chunk(chunk){
    //console.log(chunk);
    let mask = 0b1;
    let result = 0;
    while(chunk > 0){
        result += (mask & chunk) >>> 0;
        chunk = bitshift_right(chunk, 1);
    }
    return result;
}

function count_lights(turned_on){
    let result = 0;
    for(let i=0; i<turned_on.length; i++){
        //console.log(turned_on[i][1].length);
        for(let j=0; j<turned_on[i][1].length; j++){
            result += count_chunk(turned_on[i][1][j]);
        }
    }
    return result;
}

let input = read_input("./tag_6/input.txt");

const size = 1000;
const chunk_size = 32; //bit operation nutzen 32 bit integer

//new idea
let turned_on = [];

for(let i=0; i<input.length; i++){
    let cmd = sanitize_cmd(input[i]);
    //console.log(cmd);
    turned_on = operate_lights(cmd[0], cmd[1], size, chunk_size, turned_on);
    //print_turned_on(turned_on, false);
}

//print_turned_on(turned_on, false);

console.log(count_lights(turned_on));