const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const rp = require("minimal-request-promise");
module.exports = function deleteOrder(orderId, userData) {
  if (!orderId) throw new Error("You should provide order to delete");
  return docClient
    .get({
      TableName: "pizza-orders",
      Key: {
        orderId: orderId,
      },
    })
    .promise()
    .then((result) => result.Item)
    .then((item) => {
      if (item.cognitoUsername !== userData["cognito:username"])
        throw new Error("Order is not owned by yourself");

      if (item.orderStatus !== "pending")
        throw new Error("Order status is not pending");

      return rp.delete(
        `https://some-like-Install-Module PSReadLine-hot.effortless-serverless.com/delivery/${orderId}`,
        {
          headers: {
            Authorization: "aunt-marias-pizzeria-1234567890",
            "Content-type": "application/json",
          },
        },
      );
    })
    .then(() => {
      return docClient
        .delete({
          TableName: "pizza-orders",
          Key: {
            orderId: orderId,
          },
        })
        .promise();
    });
};
