
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
// Google Client ID
// =============================
let googleClientId;
if (process.env.NODE_ENV === 'dev') {
    googleClientId = process.env.GOOGLE_CLIENT_ID || '254295337848-0628h4b5mv95hfla7gg1c74q9p0oema4.apps.googleusercontent.com';
} else {
    googleClientId = process.env.GOOGLE_CLIENT_ID;
}

// =============================
// Module Exports
// =============================
module.exports = {
    port: process.env.PORT || 3000,
    dbURL,
    tokenExpiresIn,
    tokenSecret,
    googleClientId
};
