
// =============================
// Environment: default is dev
// =============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =============================
// Database
// =============================
let dbURL;

if (process.env.NODE_ENV === 'dev') {
    dbURL = 'mongodb://localhost/cafe';
} else {
    dbURL = process.env.DBURL;
}

module.exports = {
    port: process.env.PORT || 3000,
    dbURL
};
