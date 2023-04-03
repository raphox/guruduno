const functions = require("firebase-functions");
const request = require("request");

require("dotenv").config();

exports.answerQuestion = functions.firestore
    .document("/questions/{questionId}")
    .onCreate((snap, context) => {
      const data = snap.data();

      // Access the parameter `{documentId}` with `context.params`
      functions.logger.log(
          "Answering question",
          context.params.documentId,
          data.title,
      );

      const options = {
        url: "https://guruduno.onrender.com/answer_question",
        headers: {
          Authorization: `Bearer ${process.env.SECURITY_TOKEN}`,
        },
        formData: {
          event: data,
          collection: "questions",
          document: context.params.documentId,
        },
      };

      request.post(options);
    });
