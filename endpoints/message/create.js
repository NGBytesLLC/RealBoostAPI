'use strict';
 
 const uuid = require('uuid');
 const AWS = require('aws-sdk');
 
 const dynamoDb = new AWS.DynamoDB.DocumentClient();
 
 module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.text !== 'string') {
    console.error('Validation Failed'); // eslint-disable-line no-console
    callback(new Error('Couldn\'t create the todo item.'));
    return;
  }
  const params = {
    TableName: 'message-'+process.env.custom_stage,
    Item: {
      id: uuid.v1(),
    },
  };

     // create a response
  const response = {
       statusCode: 200,
       body: JSON.stringify(result.Item),
     };
     callback(null, response);
     return;
	if (event.body){
    if (event.body.sender !=null){
    	params.Item.sender = event.body.sender;

    }
    if (event.body.receiver !=null){

    }
  }

 
   // write the todo to the database
   dynamoDb.put(params, (error, result) => {
     // handle potential errors
     if (error) {
       console.error(error); // eslint-disable-line no-console
       callback(new Error('Couldn\'t create the todo item.'));
       return;
     }
 

   });
 };