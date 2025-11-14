import fs from 'node:fs';

function check_forbidden_strings(input){
    const forbidden_strings = ["ab", "cd", "pq", "xy"];
    for(let i=0; i<forbidden_strings.length; i++){
        if(input.includes(forbidden_strings[i])){
            return true;
        }
    }
    return false;
}

function check_vowel_and_double(input){
    const vowels = "aeiou";
    let vowel_counter = 0;
    let last = "";
    let double = false;
    for(let i=0; i<input.length; i++){
        if(input[i] == last){
            double = true;
        }
        if(vowels.includes(input[i])){
            vowel_counter++;
        }
        if(vowel_counter >= 3 && double){
            return true;
        }
        last = input[i];
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
    if(check_forbidden_strings(input[i])){
        continue;
    }
    if(check_vowel_and_double(input[i])){
        nice_strings++;
    }
}

console.log(nice_strings);