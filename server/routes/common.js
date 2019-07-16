
function unauthorized(res) {
    res.status(401).json({
        status: 401,
        error: 'cepsa.api.error.Unauthorized'
    });
}

function noProblem(res, err, data) {
    if (err) {
        res.status(500).json({
            status: 500,
            error: 'cepsa.api.error.InternalError',
            message: err.toString(),
            err
        });
        return false;
    }
    if (!data) {
        res.status(400).json({
            status: 400,
            error: 'cepsa.api.error.BadRequest',
            message: 'Bad Request'
        });
        return false;
    }
    return true;
}

module.exports = {
    unauthorized,
    noProblem
}
