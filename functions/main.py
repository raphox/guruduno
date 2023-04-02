import firebase_admin

from firebase_admin import firestore
from ask import execute as ask_execute

def answer_question(event, context):
    """Triggered by a change to a Firestore document.
    Args:
        event (dict): Event payload.
        context (google.cloud.functions.Context): Metadata for the event.
    """
    firebase_admin.initialize_app()

    client = firestore.client()

    path_parts = context.resource.split('/documents/')[1].split('/')
    collection_path = path_parts[0]
    document_path = '/'.join(path_parts[1:])

    affected_doc = client.collection(collection_path).document(document_path)

    question = event["value"]["fields"]["title"]["stringValue"]
    answer = ask_execute(question)

    affected_doc.update({
        u'answer': answer
    })
