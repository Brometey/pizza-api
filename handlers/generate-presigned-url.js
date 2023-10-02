const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
require("dotenv").config();

function generatePresignedUrl() {
  const params = {
    Bucket: process.env.bucketName,
    Key: uuidv4(),
    ACL: "public-read",
    Expires: 120,
  };
  return new Promise((res, rej) => {
    s3.getSignedUrl("putObject", params, function (err, url) {
      if (err) return rej(err);
      res({
        url: url,
      });
    });
  });
}

module.exports = generatePresignedUrl;
