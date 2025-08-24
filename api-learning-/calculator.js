//this is basic functionality using function to calculate based operation system
const readline = require("readline");
const axios = require('axios');
const rl = readline.createInterface({
    input : process.stdin,
    output:process.stdout
})

async function calculate(num1, num2, op){
    const url = `https://api.mathjs.org/v4/`;
    const expresion = `${num1} ${op}  ${num2}`

    try{
        const respons = await axios.post(url, {
            expr:expresion
        });
        
        return respons.data.result;

    }
    catch(error){
        console.log("this is error", error)
    }
}

rl.question("Enter first number: ",(firstNumber)=>{
    rl.question("Enter operator: ",(operator)=>{
        rl.question("Enter second number: ",async (secondNumber)=>{
            const numb1 = parseInt(firstNumber);
            const numb2 = parseInt(secondNumber)

            if(isNaN(numb1) || isNaN(numb2)){
                console.log("invalid numbers");
       
            }
            else{
                const result =  await calculate(numb1, numb2, operator);
                console.log(`The result of ${numb1} ${operator} ${numb2} is: ${result} `);
            }
            rl.close();
        })
    })
})