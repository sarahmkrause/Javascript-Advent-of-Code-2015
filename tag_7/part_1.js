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
    const size = 32;
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

function shift_16bit_left(num, shift){
    const mask = 0xFFFF;
    let result = 0;
    if(shift == 32){
        result = (num << 31 << 1) >>> 0;
    }
    else{
        result = (num << shift) >>> 0;
    }
    return result & mask;
}

function shift_16bit_right(num, shift){
    const mask = 0xFFFF;
    let result = 0;
    if(shift == 32){
        result = num >>> 31 >>> 1;
    }
    else{
        result = num >>> shift;
    }
    return result & mask;
}

function sanitize_cmd(cmd){}


let input = read_input("./tag_7/input.txt");

//const chunk_size = 32; //bit operation nutzen 32 bit integer

for(let i=0; i<input.length; i++){
    let cmd = sanitize_cmd(input[i]);
}