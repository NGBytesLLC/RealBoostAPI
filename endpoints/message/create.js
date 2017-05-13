
module.exports.get = (event, context, callback) => {
	const message = "Invalid request."
	const response = {
	  statusCode: 400,
	  body: JSON.stringify(event),
	};
	callback(null,response);
	return;
};
