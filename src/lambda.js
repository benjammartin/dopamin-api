import AWS from "aws-sdk";
import KSUID from "ksuid";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function create(event) {
  const unique = KSUID.randomSync();
  const { name, collect } = JSON.parse(event.body);

  const createParams = {
    TableName: process.env.tableName,
    Item: {
      PK: "PROJECT#" + unique.string,
      SK: "PROJECT#" + unique.string,
      createdAt: Date.now(),
      name: name,
      collect: collect,
    },
    ConditionExpression: "attribute_not_exists(PK)",
  };
  const results = await dynamoDb.put(createParams).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(results),
  };
}
