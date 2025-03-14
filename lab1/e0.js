"use strict"

let f1 = (vet) => {
    let v;
    if(vet.length < 2){
        return v;
    }
    v = (vet[0]+vet[1]+vet[vet.length-2]+vet[vet.length-1]);
    return v;
}

let test = f1("t");
console.log(test);
test = f1("miao");
console.log(test);
test = f1("cat");
console.log(test);