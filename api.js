require("dotenv").config();
const Api = require("claudia-api-builder");
const api = new Api();
const getPizzas = require("./handlers/get-pizzas.js");
const createOrder = require("./handlers/create-order");
const updateOrder = require("./handlers/update-order");
const deleteOrder = require("./handlers/delete-order");
const updateDeliveryStatus = require("./handlers/update-delivery-status");
const getSignedUrl = require("./handlers/generate-presigned-url");

// TODO: create .env file
api.registerAuthorizer("userAuthentication", {
  providerARNs: [process.env.providerARN],
});

api.get("/", () => "Welcome to Pizza API");
api.get("/pizzas", () => getPizzas());
api.get("/pizzas/{id}", (request) => getPizzas(request.pathParams.id), {
  error: 404,
});
api.post(
  "/orders",
  (request) => {
    return createOrder(request);
  },
  {
    success: 201,
    error: 400,
    cognitoAuthorizer: "userAuthentication",
  },
);
api.put(
  "/orders/{id}",
  (request) => {
    return updateOrder(request.pathParams.id, request.body);
  },
  { error: 400, cognitoAuthorizer: "userAuthentication" },
);
api.delete(
  "/orders/{id}",
  (request) => {
    return deleteOrder(
      request.pathParams.id,
      request.context.authorizer.claims,
    );
  },
  { error: 400, cognitoAuthorizer: "userAuthentication" },
);
api.post("/delivery", (request) => updateDeliveryStatus(request.body), {
  success: 200,
  error: 400,
  cognitoAuthorizer: "userAuthentication",
});

api.get(
  "upload-url",
  (request) => {
    return getSignedUrl();
  },
  {
    error: 400,
    cognitoAuthorizer: "userAuthentication",
  },
);
module.exports = api;
