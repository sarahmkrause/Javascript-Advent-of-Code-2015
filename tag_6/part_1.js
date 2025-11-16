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
function add_new_column(column, range, turned_on){
    //console.log(column + " - " + range);
    for(let i=0; i<turned_on.length-1; i++){
        if(turned_on[i][0] < column && turned_on[i+1][0] > column){
            turned_on.splice(i+1, 0, [column, range]);
            //console.log("splice: " + turned_on.join());
            return turned_on, true;
        }
    }

    if(turned_on.length == 0 || turned_on[0][0] > column){
        turned_on.splice(0, 0, [column, range]);
        //console.log("first: " + turned_on.join());
        return turned_on, true;
    }
    else if(turned_on[turned_on.length-1][0] < column){
        turned_on.push([column, range]);
        //console.log("push: " + turned_on.join());
        return turned_on, true;
    }

    return turned_on, false;
}

//TODO: Überprüfen ob sich Range der angeschaltenten Lichter geändert haben
function check_column(column_index, range, turned_on){
    column = turned_on[column_index];

    for(let i=0; i<column.length; i++){
        //1.Fall: innerhalb einer bestehenden range
        //2.Fall: außrhalb einer bestehenden range
        //3.Fall: verbindet mehrere ranges
        //Note:   komplexer - einschließend, erweitert, etc
        //4.Fall: erweitert eine range
        //Note:   link, rechts, umschließend
    }

    return turned_on;
}

//Input: [[x1,y1],[x2,y2]]
function turn_on(range, turned_on){
    let column_index_start = findIndexOfColumn(range[0][1], turned_on);
    let column_index_end = findIndexOfColumn(range[1][1], turned_on);

    let added = false;

    //alles in range durchgehen
    if(column_index_start == -1 && column_index_end == -1){
        for(let i=range[0][1]; i<range[1][1]+1; i++){
            turned_on, added = add_new_column(i, [range[0][0], range[1][0]], turned_on);
            //console.log("Lights: " + turned_on + "\nIndex:  " + i);
            console.log(added);
            if(!added){
                turned_on = check_column(findIndexOfColumn(i), [range[0][0], range[1][0]], turned_on);
            }
        }
    }
    return turned_on;
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
//print_lights(lights);

//new idea
let turned_on = [];

for(let i=0; i<input.length; i++){
    let cmd = sanitize_cmd(input[i]);
    //console.log(cmd);
    turn_on(cmd[0], turned_on);
}