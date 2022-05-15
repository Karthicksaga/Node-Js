const array = ["karthick", "Apple", "Orange"];

//spread Operator functions to copy an array

const copy_array = [...array];

copy_array[0] = "kumar";

console.log(array);
console.log(copy_array);

const person = {
    name: "karthick",
    age: 21,
    greet(){
      console.log("Hello " + this.name);
    }
};
console.log(person);

//rest Operator
//general way to passing an parameters to a function
const toArray = (a,b,c) => {
    returh [a,b,c];
}

// you can pass multiple argument to the function
const toArrayMerge = (...args) => {
    return args;
}