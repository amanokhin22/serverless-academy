import inquirer from "inquirer";
import * as fs from "fs";

const DB_FILE = "db.txt";
const createDbIfNotExists = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, "");
    }
}
const fillUsers = async () => {
    const EXIT_CONDITION = "";
    const user = await inquirer
        .prompt([
            {
                type: "input",
                name: "name",
                message: "Enter the users name. To cancel press Enter: "
            },
            {
                type: "list",
                name: "sex",
                message: "Choose your Gender: ",
                choices: ["male", "female"],
                when: (user) => {
                    return (user.name !== EXIT_CONDITION)
                }
            },
            {
                type: "input",
                name: "age",
                message: "Enter your age: ",
                validate: function (input) {
                    input = Number(input);
                    if (Number.isNaN(input)) {
                        return "You need to provide a number";
                    }

                    if (input < 1 || input > 120) {
                        return "Age should be between 1-120"
                    }
                    return true;
                },
                when: (user) => {
                    return (user.name !== EXIT_CONDITION)
                }
            }
        ])
    if (user.name === EXIT_CONDITION) {
        return null;
    } else {
        saveUsers(user);
        return fillUsers();
    }
}

const saveUsers = user => fs.appendFileSync(DB_FILE, JSON.stringify(user) + "\n");

const confirmSearch = async () => inquirer.prompt([
    {
        type: "confirm",
        name: "wantToSearchDB",
        message: "Would you to search values in DB? ",
    }
])

const loadAllData = () => {
    const allFileContents = fs.readFileSync(DB_FILE, "utf-8");
    return allFileContents.split("\n").filter(row => row !== "").map(row => JSON.parse(row));
}

const getQueryString = async () => inquirer.prompt([
    {
        type: "input",
        name: "query",
        message: "Enter user`s name you wanna find in DB: ",
        validate: input => {
            if (input === "") {
                return "Please enter some text";
            }
            return true;
        }
    }
])

const filterUsers = async () => {
    const allUsers = loadAllData();
    console.log(allUsers);
    const {query} = await getQueryString();
    const filteredUsers = allUsers.filter(user => user.name.toLowerCase() === query.toLowerCase());
    if (filteredUsers.length === 0) {
        console.log("User not found with name: ", query);
    } else {
        console.log(filteredUsers);
    }
}

const appStart = async () => {
    createDbIfNotExists();
    await fillUsers();

    const {wantToSearchDB} = await confirmSearch();
    if (!wantToSearchDB) {
        return;
    }
    await filterUsers();
}

appStart().then(() => process.exit(0));

