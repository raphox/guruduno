# Import the firebase_admin module
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Initialize the app with a service account
cred = credentials.Certificate("./serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# Get a reference to the Firestore client
db = firestore.client()


def delete_collection(coll_ref, batch_size):
    docs = coll_ref.limit(batch_size).stream()
    deleted = 0

    for doc in docs:
        doc.reference.delete()
        deleted = deleted + 1

    if deleted >= batch_size:
        return delete_collection(coll_ref, batch_size)


coll_ref = db.collection("questions")

# Remove invalid questions
delete_collection(coll_ref.where(
    "answer", "==", "Infelizmente não posso lhe ajudar com isso."), 100)

question_titles = set()

for doc in coll_ref.stream():
    title = doc.to_dict().get("title")

    # if the doc doesn't have a language, set as 'pt-BR'
    if not doc.to_dict().get("language"):
        doc.reference.update({"language": "pt-BR"})

    if title in question_titles:
        # Remove duplicated questions
        coll_ref.document(doc.id).delete()
    else:
        question_titles.add(title)
