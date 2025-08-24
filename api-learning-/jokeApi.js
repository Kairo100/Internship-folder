//this file is using jokeApi to generator joke generator app

const axios = require('axios');
const readline = require('readline');

//build interface
const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
})

// function to fetch data
async function getJoke() {
    const url = 'https://v2.jokeapi.dev/joke/Any';
    
   try{
     
    const response = await axios.get(url);

    if(response.data.type=== "single"){
        console.log(`Joke:${response.data.joke}`);
    }
    else if(response.data.type=== "twopart"){
        console.log(`Joke:${response.data.setup}`);
        console.log(`Delivery:${response.data.delivery}`);
    }
   }
   catch(error){
    console.log('There is error fetching data from jokeApi', error);
   }
}



//function based of category


async function catJoke(cat) {
    const url = `https://sv443.net/jokeapi/v2/joke/${cat}`;
    
   try{
     
    const response = await axios.get(url);

    if(response.data.category.toLowerCase()=== cat.toLowerCase()){
        if(response.data.type=== "single"){
            console.log(`Joke:${response.data.joke}`);
        }
        else if(response.data.type=== "twopart"){
            console.log(`Joke:${response.data.setup}`);
            console.log(`Delivery:${response.data.delivery}`);
        }
        
    }
    else{
        console.log('Sorry, no joke available for this category.');
    }
   
   }
   catch(error){
    console.log('There is error fetching data from jokeApi', error);
   }
}




//the rl.question cant re run so make the two be inside each other
rl.question("Would you like to hear a joke? (yes/no): ", (answer)=>{
    if(answer.toLocaleLowerCase ()=== "yes"){
        rl.question("Would you like to hear a joke? Enter your category (e.g., Programming, Misc, etc.): ", (cat)=>{
    
            if(cat.trim()=== ""){
                getJoke();
            }
            else{
                catJoke(cat)
            }
            rl.close();
    })
    
        
    }
    else{
        console.log('Okay, maybe next time!');
        rl.close();
    }
   
})


