1.  What is the difference between var, let, and const?
    Answer:
    // var → Function-scoped, can be reassigned and redeclared, hoisted.
    //let → Block-scoped, can be reassigned, cannot redeclare in the same scope.
    //const → Block-scoped, cannot be reassigned or redeclared, but objects/arrays can be modified.
2.  What is the difference between map(), forEach(), and filter()?

//forEach()
->Loops through an array and executes a function for each item.
->Does not return anything (undefined).
// map()
->Loops through an array and creates a new array with the results of the function.
->Original array stays unchanged.
//filter()
->Loops through an array and creates a new array with only the items that pass a condition.
->Useful for selecting elements. 3) What are arrow functions in ES6?
//Arrow functions are a shorter way to write functions:
example with syntax: const add = (a, b) => a + b;

4.  How does destructuring assignment work in ES6?
    //Destructuring makes one to do unpack values from arrays or objects into variables in a single line.
5.  Explain template literals in ES6. How are they different from string concatenation?
    //Template literals are a new way to write strings in ES6 using backticks (``) instead of quotes. They let us embed variables and expressions easily and write multi-line strings.
