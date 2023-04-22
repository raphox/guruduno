# Import the firebase_admin module
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Initialize the app with a service account
cred = credentials.Certificate("./serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# Get a reference to the Firestore client
db = firestore.client()

# Define a function to delete a collection


def delete_collection(coll_ref, batch_size):
    docs = coll_ref.limit(batch_size).stream()
    deleted = 0

    for doc in docs:
        doc.reference.delete()
        deleted = deleted + 1

    if deleted >= batch_size:
        return delete_collection(coll_ref, batch_size)


# Get a reference to the collection to delete
coll_ref = db.collection("questions")

# Apply a filter to the collection
coll_ref = coll_ref.where(
    "answer", "==", "Infelizmente não posso lhe ajudar com isso.")

# Call the function with a batch size of 100
delete_collection(coll_ref, 100)
