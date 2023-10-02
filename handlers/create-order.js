const AWSXray = require("aws-xray-sdk-core");
const AWS = AWSXray.captureAWS(require("aws-sdk"));
const docClient = new AWS.DynamoDB.DocumentClient();
const rp = require("minimal-request-promise");

function createOrder(request) {
  console.log("save an order", request.body);
  const userData = request.context.authorizer.claims;
  console.log("User data ", userData);

  let userAddress = request.body && request.body.address;
  if (!userAddress) {
    userAddress = JSON.parse(userData.address).formatted;
  }

  if (!request.body || !request.body.pizza || userAddress)
    throw new Error(
      "To order pizza please provide pizza type and address where pizza should be delivered",
    );

  if (!request || !request.pizza || !request.address) {
    throw new Error(`To order pizza please provide pizza type and address )}`);
  }
  return rp
    .post("https://some-like-it-hot.effortless-serverless.com/delivery", {
      headers: {
        Authorization: "aunt-marias-pizzeria-1234567890",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        pickupTime: "15.34pm",
        pickupAddress: "Aunt Maria Pizzeria",
        deliveryAddress: userAddress,
        webhookUrl:
          "https://9p1ca15s1k.execute-api.eu-central-1.amazonaws.com/latest/delivery",
      }),
    })
    .then((rawResponse) => JSON.parse(rawResponse.body))
    .then((response) => {
      return docClient
        .put({
          TableName: "pizza-orders",
          Item: {
            cognitoUsername: userAddress["cognito:username"],
            orderId: response.deliveryId,
            pizza: request.pizza,
            address: userAddress,
            orderStatus: "pending",
          },
        })
        .promise();
    })
    .then((res) => {
      console.log("Order is saved");
      return res;
    })
    .catch((err) => {
      console.log("Order is not saved: ", err);
      throw err;
    });
}

module.exports = createOrder;
