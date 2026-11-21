function sendNrInput () {
    const inputElement = document.getElementById('nr-user-input');
    const rawInput = inputElement.value.trim();
    const feedback = document.getElementById('feedback');
    const userInput = Number(rawInput);
    //validating user input
    if (rawInput === "" || isNaN(userInput)) {
        feedback.innerText = "enter digits only";

    } else {
        feedback.innerText = "";
        nrToWord(userInput);
        inputElement.value = "";
    }
}

const ones = ['', 'bir', 'iki', 'üç', 'dort', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const tens = ["", 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];

function nrToWord(nr) {

    let inWords = "";
    document.getElementById('user-nr').innerText = nr;
    nr = String(nr);
    nr = nr.split("");
    function firstThree(nr3) {
            let digit;
            let digit1;
            let digit2;
            let digit3;
        switch (nr3.length) {

            case 1:
                digit = Number(nr3[0]);
                inWords = ones[digit];
                break;
            
            case 2:
                digit1 = Number(nr3[0]);
                digit2 = Number(nr3[1]);            
                inWords = `${tens[digit1]} ${ones[digit2]}`;
                break;

            case 3:
            digit1 = Number(nr3[0]);
            digit2 = Number(nr3[1]);
            digit3 = Number(nr3[2]);
            if (digit1 === 1) {
                inWords = `yüz ${tens[digit2]} ${ones[digit3]}`
            } else {
                inWords = `${ones[digit1]} yüz ${tens[digit2]} ${ones[digit3]}`;
            }
            break;
        }
        return inWords;
    }
    function thousands (nr) {
        //copying last three elements of array 
        let first3 = nr.slice(-3);
        //copying everything but the last three digits of array
        let thousandDigits = nr.slice(0, -3);
        let nameThousands = firstThree(thousandDigits);
        let inWords = `${nameThousands} bin ${firstThree(first3)}`;
        return inWords;

    }

    function millions (nr) {
        //copies the millions digits part of array
        let milDigits = nr.slice(0, -6);
        //copies last digits to this array
        let remDigits = nr.slice(-6);
        let milName = `${firstThree(milDigits)} milyon ${thousands(remDigits)}`;
        return milName;
        


    }

    function billions (nr) {
        //copying billions part of number 
        let bilDigits = nr.slice(0, -9);
        //copying remaining digits
        let remDigits = nr.slice(-9);
        let bilName = `${firstThree(bilDigits)} milyan ${remDigits}`;
        return bilName;
    }
    let valWords;
    if (nr.length > 9) {
        valWords = billions(nr);
    } else if (nr.length > 6) {
        valWords = millions(nr);
    } else if (nr.length > 3) {
        valWords = thousands(nr);
        
    } else if (nr.length > 0) {
        valWords = firstThree(nr);
    } else {
        valWords = "number undefined"
    }
    valWords = capFirstLetter(valWords);
    //console.log(valWords);
    document.getElementById('txt-results').innerText = valWords;

    return valWords
}

function showView(viewId) {
    //1. hiding other views
    document.querySelectorAll('.view').forEach( div => {
        div.style.display = "none"; 
    });

    //2.showing requested view
    if (viewId = 'game-screen') {
        document.getElementById('game-menu').style.display = 'block';
    }
    document.getElementById(viewId).style.display = "flex";
    

}
function capFirstLetter (word) {
    word = word.charAt(0).toUpperCase().concat(word.slice(1));
    return word;
}

function wordToNr (word) {
    word = word.toLowerCase();
    let wordArray = word.split(" ");
    //console.log(wordArray);
    let nrVal = 0;
    function namingHundred (fourElemArray) {
        //console.log(fourElemArray);
        let hundredVal = 0;
        //maximum elements array can/should contain is four
        if (fourElemArray.includes('yüz')) {
            if (fourElemArray.indexOf('yüz') === 0) {
                hundredVal = 100;
                fourElemArray.splice(0, 1);

            } else if (fourElemArray.indexOf('yüz') === 1) {
                hundredVal = 100 * ones.indexOf(fourElemArray[0]);
                fourElemArray.splice(0, 2);
            }
        } 

        if (fourElemArray.length > 0) {

            if (tens.includes(fourElemArray[0])) {
                //adding tens value
                hundredVal = hundredVal + (tens.indexOf(fourElemArray[0]) * 10);
                //adding ones value
                if (ones.includes(fourElemArray[1])) {
                    hundredVal = hundredVal + (ones.indexOf(fourElemArray[1]));
                }                
            } else if (ones.includes(fourElemArray[0])) {
                hundredVal = hundredVal + ones.indexOf(fourElemArray[0]);
            }
            return hundredVal;
        } else { 
            return hundredVal;
        }
        
    }

    //writing loop to convert word to number starting from billions
    while (wordArray.length > 0) {
        if (wordArray.includes('milyan')) {
           let bilIndex = wordArray.indexOf('milyan'); 
           let bilArray = wordArray.slice(0, bilIndex);
           nrVal = namingHundred(bilArray) * 1000000000;

           //removing the converted elements from array
           wordArray.splice(0, bilIndex +1);
           //statement that evaluates incase there are no  more digits
           if (wordArray.length === 0) {return nrVal;}


        } else if (wordArray.includes('milyon')) {
            let milIndex = wordArray.indexOf('milyon');
            let milArray = wordArray.slice(0, milIndex);
            nrVal = nrVal + namingHundred(milArray) * 1000000;
           

            //removing converted elements from array
            wordArray.splice(0, milIndex +1);

            //checks if there are no more string values to evaluate
           if (wordArray.length === 0) {return nrVal;}             
        } else if (wordArray.includes('bin')) {
            let thouIndex = wordArray.indexOf('bin');
            let thouArray = wordArray.slice(0, thouIndex);
            nrVal = nrVal + namingHundred(thouArray) * 1000;
            

            //removing converted elements from array
            wordArray.splice(0, thouIndex + 1);

            //checks if there are no more string values to evaluate
           if (wordArray.length === 0) {return nrVal;}            
        } else {
            nrVal = nrVal + namingHundred(wordArray);
            //writing condition to check and remove values in the tens & tens
            for (let i = 0; i < wordArray.length; i++) {
                if (tens.includes(wordArray[i])) {
                    wordArray.splice(i, 1);
                    if (ones.includes(wordArray[i])) {
                        wordArray.splice(i, 1);
                    }
                } else if (ones.includes(wordArray[i])) {
                    wordArray.splice(i, 1);
                }
            }
            //checking whether array is empty
            if (wordArray.length === 0) {
                //checks whether string value is invalid or 
                if (isNaN(nrVal)) {
                    return "Invalid string value";
                } else {
                    return nrVal;
                }
            } else {
                return "Some of the values entered may be incorrectly spelt"
            }
        }
    }
    
    
    


}

function sendTxtInput() {
    const txtInputElement = document.getElementById('txt-user-input');
    const txtInput = txtInputElement.value;
    const txtResults = wordToNr(txtInput);
    document.getElementById('user-txt').innerText = txtInput;
    document.getElementById('nr-results').innerText = txtResults;
    txtInputElement.value = "";

}

function switchGameView(name) {
    //hiding other views
    document.querySelectorAll('.game-view').forEach ( div => {
        div.style.display = "none";
    });
    document.getElementById('game-menu').style.display = "none";
    //showing requested view
    //document.getElementById('game-screen').style.backgroundColor = "blue";
    document.getElementById(name).style.display = "block";
}

/*
To be added at a later date :)
//3 second timer countdown
const getReadyTimer = setInterval ( () => {

}, 1000);

*/

/**
function that:
generates a random number and uses it as quiz value
gets the word version of the number, and randomly assigns it to choice container
generates two others and assigns it to remaining text containers
 */

function quizGenerator () {
    

    //randomly selecting number or word on quiz with bias on words
    let quizType = Math.floor(Math.random() * 3) + 1;

    //getting list of the choices' text containers
    const choices = document.querySelectorAll('.choice');
    let pos = Math.floor(Math.random() * 3);

    let ansNumber = Math.floor(Math.random() * 1000) + 1;
    let ansWord = nrToWord(ansNumber);
    if (quizType === 1) {
        //generating quiz where user chooses text
        document.getElementById('generated-number').innerText = ansNumber;

        for (let i = 0; i < choices.length; i++) {
            if (pos === i) {
              choices[i].innerText = ansWord;
            } else {
                choices[i].innerText = nrToWord(Math.floor(Math.random() * 1000));
            }
        }
        return ansNumber;


    } else {
        //generating quiz where user chooses number
        document.getElementById('generated-number').innerText = ansWord;

        for (let i = 0; i < choices.length; i++) {
            if (pos === i) {
                choices[i].innerText = ansNumber;
            } else {
                choices[i].innerText = Math.floor(Math.random() * 1000);
            }
        }
        return ansWord;

    }


}
//generating class type for storing and marking the user input
class Answer {
    constructor (quizNumber, userAnswer) {
        this.quizNumber = quizNumber;
        this.answer = isNaN(quizNumber) ? wordToNr(quizNumber): nrToWord(quizNumber);
        this.userAnswer = userAnswer;
        this.state = this.answer == this.userAnswer ? true : false;
    }
}

//creating game record 
class GameRecord {
    constructor(ansArray, userTime, userScore) {
        this.ansArray = ansArray;
        this.userTime = userTime;
        this.userScore = userScore;
    }
}
const totalRecord = [];

let generatedNumber = quizGenerator();
let questionCounter = 0;
let userAnswerArray = [];
let quizNo = 10;

function submitAns(ansId) {
    setTimeout(() => { generatedNumber = quizGenerator();}, 100);

    const quizNr = generatedNumber;
    const userAnswer = document.getElementById(ansId).innerText;

    userAnswerArray[questionCounter] = new Answer (quizNr, userAnswer);
    
    
    
    questionCounter++;

    //checking if user has completed assigned turn number turns 
    if (questionCounter === quizNo) {
        //marking end time 
        let endTime = new Date();
        endTime = Date.parse(endTime);
    
        document.getElementById('start-game').style.display = 'none';
        document.getElementById('game-stats').style.display = 'block';

        //let correct questions
        const correctQuestions = userAnswerArray.filter(ans => ans.state === true).length;
        document.getElementById('correct-ans').innerText = `Questions you got correct: ${correctQuestions}`;
        if (correctQuestions !== quizNo ) {
            document.getElementById('wrong-ans').innerText = `Questions you got wrong: ${quizNo - correctQuestions}.`;
        }
        const timeTaken = Math.trunc(endTime - startTime) / 1000;
        console.log(startTime, endTime);

        document.getElementById('time-taken').innerText = `You took ${timeTaken} seconds to complete!`
        const score = Math.round(correctQuestions/ quizNo * 100);
        document.getElementById('score').innerHTML = `Your score is <strong>${score}%</strong>`;

        //storing the user's game instance 
        const gameInstance = new GameRecord(userAnswerArray, timeTaken, score);
        totalRecord.push(gameInstance);



    }

}
function goHome () {

    document.querySelectorAll('.view').forEach (div =>{
        div.style.display = 'none';
    });
    document.querySelectorAll('.game-view').forEach (div => {
        div.style.display = 'none';
    })
    document.getElementById('first-page').style.display = "flex";
}
let startTime;
function gameStart (level="easy") {

    //initializing variable
    generatedNumber = quizGenerator();
    questionCounter = 0;
    userAnswerArray = [];
    startTime = new Date();
    startTime = Date.parse(startTime);
    
    if (level === 'easy') {
        quizNo = 10;
    } else if (level === 'medium') {
        quizNo = 15;
    } else if (level === 'hard') {
        quizNo = 20;
    }

}


function showRecord() {
    const recordList = document.getElementById('game-record-list');
    const averageStatsEl = document.getElementById('average-stats');

    
    if (totalRecord.length === 0) {
        recordList.innerHTML = '<li>No games played yet.</li>';
        averageStatsEl.innerHTML = '';
        return;
    }

    let accuracy = 0;
    let totalTime = 0;
    let listHTML = ''; // Build the HTML string in memory first 

    totalRecord.forEach((element, index) => {
        console.log(element, index);
        listHTML += `
        <li>
          <p>Game ${index + 1} — Percentage score: ${element.userScore}%</p>
          <p>Time taken: ${element.userTime} seconds</p>
        </li>`;
        accuracy += element.userScore;
        totalTime += element.userTime;
    });

    recordList.innerHTML = listHTML;

    const avgTime = Math.round(totalTime / totalRecord.length);
    const avgScore = Math.round(accuracy / totalRecord.length);

    averageStatsEl.innerHTML = `
        Your average time per game is ${avgTime} seconds <br>
        Your average score per game is ${avgScore}%
    `;
}




