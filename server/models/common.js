
const countDocumentsByCondition = (Model) => (condition = {}) => new Promise((resolve, reject) => {
    Model.countDocuments(condition, (err, count) => {
        if (err) {
            reject(err);
        } else {
            resolve(count);
        }
    });
});

const fetchDocumentsByCondition = (Model) => (condition = {}, offset = 0, max = 5) => new Promise((resolve, reject) => {
    Model.find(condition)
        .skip(offset)
        .limit(max)
        .exec((err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
});

module.exports = {
    countDocumentsByCondition,
    fetchDocumentsByCondition
}
