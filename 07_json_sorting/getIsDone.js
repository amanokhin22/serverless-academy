const getIsDone = (data) => {
    if (data.isDone !== undefined) {
        return data.isDone;
    }
    if (Array.isArray(data)) {
        for (const item of data) {
            if (typeof item === 'object') {
                const res = getIsDone(item);
                if (res !== undefined) {
                    return res
                }
            }
        }
        return;
    }
    for (const key in data) {
        if (typeof data[key] === 'object') {
            const res = getIsDone(data[key]);
            if (res !== undefined) {
                return res
            }
        }
    }
};

module.exports = getIsDone;