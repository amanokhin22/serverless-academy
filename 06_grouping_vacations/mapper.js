function groupVacationsByUsers(vacations) {
    const users = {};

    vacations.forEach(vacation => {
        const userId = vacation.user._id;
        const userName = vacation.user.name;
        const startDate = vacation.startDate;
        const endDate = vacation.endDate;
        if (!users[userId]) {
            users[userId] = {
                userId: userId,
                userName: userName,
                vacations: []
            }
        }
        users[userId].vacations.push({startDate, endDate})
    })

    return users;
}

module.exports = groupVacationsByUsers;