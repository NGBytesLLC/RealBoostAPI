'use strict';

//trying the pipeline  dgdfgdfgd
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: 'message-'+process.env.custom_stage,
};


module.exports.list = (event, context, callback) => {
  // fetch all todos from the database
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error); // eslint-disable-line no-console
      callback(new Error('Couldn\'t fetch the users messages.'));
      return;
    }
    const data = {
    	data: JSON.stringify(result.Items),
    	message: "",
    	success: "true",
    };

    const response = {
      statusCode: 200,
      body: data,
    };
    callback(null, response);
  });
};
