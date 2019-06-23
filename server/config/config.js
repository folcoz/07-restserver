
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

// =============================
// Token config
// =============================
let tokenExpiresIn = 60 * 60; // 1 hour
if (process.env.TOKEN_EXPIRY_IN_SECONDS) {
    tokenExpiresIn = Number(process.env.TOKEN_EXPIRY_IN_SECONDS);
}

let tokenSecret;
if (process.env.NODE_ENV === 'dev') {
    tokenSecret = process.env.TOKEN_SECRET || 'dev-secret';
} else {
    tokenSecret = process.env.TOKEN_SECRET;
}

// =============================
// Module Exports
// =============================
module.exports = {
    port: process.env.PORT || 3000,
    dbURL,
    tokenExpiresIn,
    tokenSecret
};
