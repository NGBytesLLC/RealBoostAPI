'use strict';

//trying the pipeline  dgdfgdfgd
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: 'message-'+process.env.custom_stage,
};

module.exports.create = (event, context, callback) => {
	 callback(JSON.stringify(event));
      return;
  // fetch all todos from the database
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors

    const data = {
    	data: {
    		data: result.Items,
    		start: 0,
    		total: result.Items.length,
    		limit:100,
    	},
    	message: "",
    	success: true,

    };

    const response = {
      statusCode: 200,
      body: JSON.stringify(data),
    };
    callback(null, response);
  });
};
