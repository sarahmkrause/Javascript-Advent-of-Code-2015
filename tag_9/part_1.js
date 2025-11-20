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
    line = line.split(" = ");
    return [line[0].split(" to "), Number(line[1])];
} 

function shortest_path(start, end, org_locations, paths){
    let locations = structuredClone(org_locations);
}

let input = read_input("./tag_9/input.txt");

let paths = [];

let total_locations = new Set();
let start_locations = new Set();
let end_locations = new Set();

for(let i=0; i<input.length; i++){
    let path = parse(input[i]);
    let start = path[0][0];
    let end = path[0][1];
    if(typeof(paths[start]) == "undefined"){
        paths[start] = [];
    }
    paths[start][end] = path[1];
    total_locations.add(start);
    total_locations.add(end);
    start_locations.add(start);
    end_locations.add(end);
}

let common_locations = start_locations.intersection(end_locations) 
let start_location = start_locations.difference(common_locations).entries().next().value[0];
let end_location = end_locations.difference(common_locations).entries().next().value[0];
total_locations.delete(start_location);
total_locations.delete(end_location);

console.log(paths);
console.log(total_locations);
console.log(start_location);
console.log(end_location);