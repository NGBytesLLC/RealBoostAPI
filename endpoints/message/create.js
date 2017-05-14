'use strict';
 
 const uuid = require('uuid');
 const AWS = require('aws-sdk');
 
 const dynamoDb = new AWS.DynamoDB.DocumentClient();
 const TableName = 'message-'+process.env.custom_stage;
 
 module.exports.create = (event, context, callback) => {
   const timestamp = new Date().getTime();
   const data = JSON.parse(event.body);
   const response = {
       statusCode: 200,
       body: JSON.stringify(event),
    };
   callback(null,response);
   if (typeof data.text !== 'string') {
     console.error('Validation Failed'); // eslint-disable-line no-console
     callback(new Error('Couldn\'t create the todo item.'));
     return;
   }
 
   const params = {
     TableName: TableName,
     Item: {
       id: uuid.v1(),
       date: timestamp,
       type: type,
       sender: sender,
       receiver: receiver,
       html: html,
     },
   };
 
   // write the todo to the database
   dynamoDb.put(params, (error, result) => {
     // handle potential errors
     if (error) {
       console.error(error); // eslint-disable-line no-console
       callback(new Error('Couldn\'t create the todo item.'));
       return;
     }
 
     // create a response
     const response = {
       statusCode: 200,
       body: JSON.stringify(result.Item),
     };
     callback(null, response);
   });
 };