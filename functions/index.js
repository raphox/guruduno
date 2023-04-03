const functions = require("firebase-functions");

require("dotenv").config();

exports.answerQuestion = functions.firestore
    .document("/questions/{questionId}")
    .onCreate((snap, context) => {
      const data = snap.data();

      functions.logger.log(
          "Answering question",
          context.params.questionId,
          data.title,
      );

      fetch("https://guruduno.onrender.com/answer_question", {
        method: "post",
        body: JSON.stringify({
          event: data,
          collection: "questions",
          document: context.params.questionId,
        }),
        headers: {
          Authorization: `Bearer ${process.env.SECURITY_TOKEN}`,
        },
      });
    });
