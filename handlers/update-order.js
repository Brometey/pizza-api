const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

function updateOrder(id, options) {
  if (!id || !options)
    throw new Error("Order id and updates are required for updating the order");
  return docClient
    .update({
      TableName: "pizza-orders",
      UpdateExpression: "set pizza = :p, address =:a",
      ExpressionAttributeNames: {
        ":p": options.pizza,
        ":a": options.address,
      },
      ReturnValues: "ALL_NEW",
    })
    .promise()
    .then((result) => {
      console.log("Order is updated: ", result);
      return result.Attributes;
    })
    .catch((err) => {
      throw err;
    });
}

module.exports = updateOrder;
