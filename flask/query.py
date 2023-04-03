import pinecone

from langchain.vectorstores import Pinecone
from langchain.embeddings.openai import OpenAIEmbeddings

def execute(query, k=2, index_name="uno-rules", namespace=None):
    pinecone.init()

    index = pinecone.Index(index_name)
    embeddings = OpenAIEmbeddings()
    vectorstore = Pinecone(index, embeddings.embed_query, "text")

    return vectorstore.similarity_search_with_score(query, k=k, namespace=namespace)

def upsert_question(question, answer, index_name="uno-rules", namespace="questions"):
    embeddings = OpenAIEmbeddings()
    metadata = { "answer": answer }

    return Pinecone.from_texts(
        [question],
        embeddings,
        metadatas=[metadata],
        index_name=index_name,
        namespace=namespace
    )
