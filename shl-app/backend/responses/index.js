function sendResponse(status, data) {
    return {
        statusCode: status,
        headers : {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
    };
}

function sendError(status, data) {
    return {
        statusCode: status,
        headers : {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
    };
}

module.exports = { sendResponse, sendError };