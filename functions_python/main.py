import firebase_admin

from firebase_admin import firestore
from langchain.schema import AIMessage
from ask import execute as ask_execute
from query import upsert_question, execute as query_execute

firebase_admin.initialize_app()

def answer_question(event, context):
    """Triggered by a change to a Firestore document.
    Args:
        event (dict): Event payload.
        context (google.cloud.functions.Context): Metadata for the event.
    """
    client = firestore.client()

    path_parts = context.resource.split('/documents/')[1].split('/')
    collection_path = path_parts[0]
    document_path = '/'.join(path_parts[1:])

    affected_doc = client.collection(collection_path).document(document_path)

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
