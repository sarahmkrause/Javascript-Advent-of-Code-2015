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

function parse(line){
    let state = 0;
    let extra = 0;
    let value = 0;
    for(let i=0; i<line.length; i++){
        //Fall: Beginn der Escape Sequence | \
        if(state == 0 && line[i] == "\\"){
            state = 1;
        }
        //Fall: Single Quotation | "
        else if(state == 0 && line[i] == "\""){
            extra += 2;
        }
        //Fall: Fortführung der Escape Sequence für hexadezimales Encoding | x
        else if(state == 1 && line[i] == "x"){
            state = 2;
        }
        //Fall: Fortführung der Escape Sequence für Backslash oder Quotation | [\|"]
        else if(state == 1 && (line[i] == "\\" || line[i] == "\"")){
            state = 0;
            extra += 2;
            value += 1;
        }
        //Fall: Ende der Escape Sequence für hexadezimales Encoding | [0-9|a-f][0-9|a-f]
        else if(state == 2 && ((line.charCodeAt(i) >= 48 && line.charCodeAt(i) <= 57) || (line.charCodeAt(i) >= 97 && line.charCodeAt(i) <= 102))){
            state = 0;
            extra += 1;
            value += 1;
            i++;
        }
        //Fall: keine speziellen Codezeichen
        else{
            value += 1;
        }
    }
    //console.log(line.length + extra, " - ", value);
    return extra;
}

let input = read_input("./tag_8/input.txt");

let result = 0;

for(let i=0; i<input.length; i++){
    result += parse(input[i]);
}
console.log(result);