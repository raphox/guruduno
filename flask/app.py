import os
import time
import threading
import firebase_admin

from dotenv import load_dotenv
from firebase_admin import firestore, credentials
from langchain.schema import AIMessage

from flask import Flask, request
from flask_httpauth import HTTPTokenAuth

from ask import execute as ask_execute
from query import upsert_question, execute as query_execute

load_dotenv()

cred = credentials.Certificate("./serviceAccountKey.json")
firebase_admin.initialize_app(cred)

app = Flask(__name__)
auth = HTTPTokenAuth(scheme='Bearer')
tokens = {
    os.environ.get('FIREBASE_TOKEN'): "firebase"
}


@auth.verify_token
def verify_token(token):
    if token in tokens:
        return tokens[token]


@app.route('/answer_question', methods=['POST'])
@auth.login_required
def answer_question():
    data = request.get_json()

    def long_running_task(**kwargs):
        data = kwargs.get(
            'post_data', {"event": {}, "collection": "",  "document": ""}
        )

        event = data["event"]
        collection_path = data["collection"]
        document_path = data["document"]

        client = firestore.client()

        affected_doc = client.collection(
            collection_path).document(document_path)

        answer = None
        question = event["value"]["fields"]["title"]["stringValue"]
        similarity_search = query_execute(question, k=1, namespace="questions")

        if similarity_search:
            document, score = similarity_search[0]

            if score > 0.95:
                answer = AIMessage(content=document.metadata['answer'])

        if not answer:
            answer = ask_execute(question)
            upsert_question(question, answer.content)

        affected_doc.update({
            u'answer': answer.content
        })

    thread = threading.Thread(
        target=long_running_task,
        kwargs={'post_data': data}
    )

    thread.start()

    return {"message": "Accepted"}, 202


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)