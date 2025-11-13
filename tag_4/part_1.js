import fs from 'node:fs';
import MD5 from "crypto-js/md5.js";

let secret = fs.readFileSync("./tag_4/input.txt", 'utf8');

let result = 0;

let hash = MD5(secret + result);

//Naive Lösung: jede Zahl überprüfen bis der Hash 5 leading zeros hat
while(hash.toString().substring(0,5) != "00000"){
    hash = MD5(secret + ++result);
}

//console.log(hash.toString());
console.log(result);