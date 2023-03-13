const getSortedAlphabetically = (arrayWords) => {
   return arrayWords
        .filter((item) => !/^[+-]?\d+(\.\d+)?$/.test(item))
        .sort((a, b) => {
            if (a.toLowerCase() > b.toLowerCase()) {
                return 1
            } else if (a.toLowerCase() < b.toLowerCase()) {
                return -1
            }
            return 0
        })
}
const getNumbersFromLesserToGreater = (arrayWords) => {
    return arrayWords
        .filter((item) => Number(item))
        .sort((a, b) => a - b)
        .map(item => +item)
        .join(" ")
}
const getNumbersFromBiggerToSmaller = (arrayWords) => {
    return arrayWords
        .filter((item) => Number(item))
        .sort((a, b) => b - a)
        .map(item => +item)
        .join(" ")
}
const getWordsAscendingByNumbersOfLetter = (arrayWords) => {
    return arrayWords
        .sort((a, b) => a.length - b.length)
        .join(" ")
}
const getUniqueWords = (arrayWords) => {
   return Array.from(new Set(arrayWords))
        .filter(item => !Number(item))
}
const getUniqueValuesOfWordsAndNumbers = (arrayWords) => {
    return Array.from(new Set(arrayWords))
}

module.exports = {
    getSortedAlphabetically,
    getNumbersFromLesserToGreater,
    getNumbersFromBiggerToSmaller,
    getWordsAscendingByNumbersOfLetter,
    getUniqueWords,
    getUniqueValuesOfWordsAndNumbers
};
