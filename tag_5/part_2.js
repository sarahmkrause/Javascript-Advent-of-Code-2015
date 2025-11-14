import fs from 'node:fs';

function is_nice_string(input){
    let condition_one = false;
    let condition_two = false;

    let pair = input.substring(0, 2);
    let single = input[0];

    for(let i=2; i<input.length; i++){
        if(!condition_one && single == input[i]){
            condition_one = true; 
        }
        else {
            single = input[i-1];
        }
        if(!condition_two){
            let sub = input.substring(i, input.length);
            if(sub.includes(pair)){
                condition_two = true;
                //console.log("Pair: " + pair);
            }
            else{
                pair = pair[1] + input[i];
            }
        }
        if(condition_one && condition_two){
            //console.log(input);
            return true;
        }
    }
    return false;
}

let input = fs.readFileSync("./tag_5/input.txt", 'utf8');
input = input.split("\n");

//entfernt den Eintrag der durch die leerzeile entstanden ist
if(input[input.length-1] == ""){
    input.pop();
}

let nice_strings = 0;
for(let i=0; i<input.length; i++){
    if(is_nice_string(input[i])){
        nice_strings++;
    }
}

console.log(nice_strings);