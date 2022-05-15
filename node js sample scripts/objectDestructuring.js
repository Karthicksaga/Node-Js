const person = {
    name : 'John',
    age : 30,
    status : 'single'
}
// way to call Object Destructuring
const {name, age, status} = person;

console.log(name,age);
console.log(status);


//destructure array 
const hobbies = ['sports', 'movies', 'music'];
const [hobby1, hobby2, hobby3] = hobbies;
console.log(hobby1, hobby2, hobby3);
