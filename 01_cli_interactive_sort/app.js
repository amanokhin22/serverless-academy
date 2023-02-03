const readline = require('readline');

const rl = readline.createInterface({input: process.stdin, output: process.stdout});
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

(async () => {
    try {
        while (true) {
            const words = await prompt("Hello. Enter 10 words or digits them in spaces: ");
            const arrayWords = words.split(" ")
            if (words === "exit") {
                break
            }
            if (words === "") {
                rl.write("Please enter at least one symbol \n")
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
                    const output = arrayWords
                        .filter((item) => !/^[+-]?\d+(\.\d+)?$/.test(item))
                        .sort((a, b) => {
                            if (a.toLowerCase() > b.toLowerCase()) {
                                return 1
                            } else if (a.toLowerCase() < b.toLowerCase()) {
                                return -1
                            }
                            return 0
                        })
                    console.log(output.join(" "))
                    break;
                case "2": {
                    const output = arrayWords
                        .filter((item) => Number(item))
                        .sort((a, b) => a - b)
                        .map(item => +item)
                        .join(" ")
                    console.log(output)
                    break;
                }
                case "3": {
                    const output = arrayWords
                        .filter((item) => Number(item))
                        .sort((a, b) => b - a)
                        .map(item => +item)
                        .join(" ")
                    console.log(output)
                    break;
                }
                case "4": {
                    const output =
                        arrayWords
                            .sort((a, b) => a.length - b.length)
                            .join(" ")
                    console.log(output)
                    break;
                }
                case "5": {
                    const output = Array.from(new Set(arrayWords))
                        .filter(item => !Number(item))
                    console.log(output.join(" "))
                    break;
                }
                case "6": {
                    const output = Array.from(new Set(arrayWords))
                    console.log(output.join(" "))
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