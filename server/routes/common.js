
function unauthorized(res) {
    res.status(401).json({
        status: 401,
        error: 'cepsa.api.error.Unauthorized'
    });
}

module.exports = {
    unauthorized
}
