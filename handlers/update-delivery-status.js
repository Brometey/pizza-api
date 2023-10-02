const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = function updatedDeliveryStatus(request) {
  if (!request.deliveryId || !request.status)
    throw new Error("Status and delivery Id are required");

  return docClient
    .update({
      TableName: "pizza-orders",
      Key: {
        orderId: request.deliveryId,
      },
      AttributeUpdates: {
        deliveryStatus: {
          Action: "PUT",
          Value: request.status,
        },
      },
    })
    .promise()
    .then(() => {
      return {};
    });
};
