const functions = require("firebase-functions");
const request = require("request");

exports.answerQuestion = functions.firestore
  .document("/questions/{questionId}")
  .onCreate((snap, context) => {
    const data = snap.data();

    // Access the parameter `{documentId}` with `context.params`
    functions.logger.log(
      "Answering question",
      context.params.documentId,
      data.title
    );

    request("http://www.google.com", (error, response, body) => {
      console.error("error:", error); // Print the error if one occurred
      console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
      console.log("body:", body); // Print the HTML for the Google homepage.
    });
  });
