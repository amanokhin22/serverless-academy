const readline = require('readline');
const {
    getSortedAlphabetically,
    getNumbersFromLesserToGreater,
    getNumbersFromBiggerToSmaller,
    getWordsAscendingByNumbersOfLetter,
    getUniqueWords,
    getUniqueValuesOfWordsAndNumbers
} = require('./handlers');

const rl = readline.createInterface({input: process.stdin, output: process.stdout});
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

(async () => {
    try {
        while (true) {
            const words = await prompt("Hello. Enter 10 words or digits them in spaces: ");

            if (!words.trim()) {
                rl.write("Please enter at least one symbol \n")
                continue
            }
            const arrayWords = words.split(" ")
            if (words === "exit") {
                break
            }
            if (arrayWords.length < 2) {
                rl.write("Please enter more words or digits \n")
                continue
            }
            if (arrayWords.length > 10) {
                rl.write("No more than 10 words or digits \n")
                continue
            }
            const operation = await prompt(
                `Please type number from 1 to 6 to choose an operation
1. Sort words alphabetically 
2. Show numbers from lesser to greater
3. Show numbers from bigger to smaller
4. Display words in ascending order by number of letters in the word
5. Show only unique words 
6. Display only unique values from the set of words and numbers entered by the user
To exit the program, the user need to enter exit, otherwise the program will repeat itself again and again, asking for new data and suggesting sorting: `
            );
            switch (operation) {
                case "1":
                    console.log(getSortedAlphabetically(arrayWords));
                    break;
                case "2": {
                    console.log(getNumbersFromLesserToGreater(arrayWords))
                    break;
                }
                case "3": {
                    console.log(getNumbersFromBiggerToSmaller(arrayWords))
                    break;
                }
                case "4": {
                    console.log(getWordsAscendingByNumbersOfLetter(arrayWords))
                    break;
                }
                case "5": {
                    console.log(getUniqueWords(arrayWords))
                    break;
                }
                case "6": {
                    console.log(getUniqueValuesOfWordsAndNumbers(arrayWords))
                    break;
                }
                case "exit":
                    rl.close();
                    return;
                default:
                    console.log(`Cannot find command ${operation}`)
            }
        }
        rl.close();
    } catch (err) {
        console.error("Unable to prompt", err);
    }
})();

rl.on('close', () => process.exit(0));
