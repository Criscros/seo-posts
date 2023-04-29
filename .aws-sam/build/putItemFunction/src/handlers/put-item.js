// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;

const { v4: uuidv4 } = require('uuid');



const multer = require('multer');
const upload = multer();

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.putItemHandler = async (event) => {
    console.log('***********', event)
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    // Get id and name from the body of the request
    const body = JSON.parse(event.body);
    const id = uuidv4();

    const image = body.image

    const author= body.author
    const title = body.title
    const description = body.description
    const tags = body.tags



    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      };

    let response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
        headers : headers
    };

    try {
        const params = {
            TableName : tableName,
            Item: { 
                id : id,
                title:title,
                description:description,
                author:author,
                tags:tags
            }
        };
    
     const result = await docClient.put(params).promise();
     console.log(result);
    
        response = {
            statusCode: 200,
            body: JSON.stringify(body),
            headers : headers
        };
    } catch (ResourceNotFoundException) {
        response = {
            statusCode: 404,
            body: "Unable to call DynamoDB. Table resource not found.",
            headers : headers
        };
    }

    // All log statements are written to CloudWatch
    // console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    // console.log('**********',response)
    return response;
};
