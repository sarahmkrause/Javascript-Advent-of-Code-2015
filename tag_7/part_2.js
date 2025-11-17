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

function sanitize_cmd(cmd){
    cmd = cmd.split(" -> ");
    cmd[0] = cmd[0].split(" ");
    //console.log(cmd[0]);
    let op = [];
    if(cmd[0].length == 1){
        op = ["ASSIGN", cmd[0][0]];
        if(!isNaN(op[1])){
            op[1] = [Number(op[1])];
        }
        else{
            op[1] = [op[1]];
        }
    }
    else if(cmd[0].length == 2){
        op = [cmd[0][0], cmd[0][1]];
        if(!isNaN(op[1])){
            op[1] = [Number(op[1])];
        }
        else{
            op[1] = [op[1]];
        }
    }
    else if(cmd[0].length == 3){
        op = [cmd[0][1], [cmd[0][0], cmd[0][2]]];
        if(!isNaN(op[1][0])){
            op[1][0] = Number(op[1][0]);
        }
        if(!isNaN(op[1][1])){
            op[1][1] = Number(op[1][1]);
        }
    }
    cmd[0] = op;
    return cmd;
}

function eval_wire(wire, variables){
    let op = variables[wire][0];
    let operands = variables[wire][1];

    if(operands.length == 2){
        //console.log(op);
        //console.log(operands);
        if(typeof(operands[0]) === "string"){
            operands[0] = eval_wire(operands[0], variables);
        }
        if(typeof(operands[1]) === "string"){
            operands[1] = eval_wire(operands[1], variables);
        }
    }
    else{
        if(typeof(operands[0]) === "string"){
            operands = eval_wire(operands[0], variables);
        }
        else{
            operands = operands[0];
        }
    }

    if(op == "ASSIGN"){
        wire = operands;
    }
    else if(op == "NOT"){
        wire = ~operands;
    }
    else if(op == "AND"){
        wire = operands[0] & operands[1];
    }
    else if(op == "OR"){
        wire = operands[0] | operands[1];
    }
    else if(op == "LSHIFT"){
        wire = shift_16bit_left(operands[0], operands[1]);
    }
    else if(op == "RSHIFT"){
        wire = shift_16bit_right(operands[0], operands[1]);
    }

    wire = wire & 0xFFFF;

    return wire;
}


let input = read_input("./tag_7/input.txt");

//const chunk_size = 32; //bit operation nutzen 32 bit integer

let variables = [];
let wire = "a";


for(let i=0; i<input.length; i++){
    let cmd = sanitize_cmd(input[i]);
    //console.log(cmd);
    variables[cmd[1]] = cmd[0];
}
//console.log(variables);
//console.log(variables);
//console.log(variables["b"]);
variables["b"] = ["ASSIGN", [eval_wire("a", structuredClone(variables))]];
//console.log(variables["b"]);
//console.log(variables);
console.log(eval_wire("a", variables));