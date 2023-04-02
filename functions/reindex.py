import requests

from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import MarkdownTextSplitter
from langchain.document_loaders import UnstructuredMarkdownLoader
from langchain.vectorstores import Pinecone

def execute():
    file_name = "rules.pt-br.md"
    url = f"https://raw.githubusercontent.com/raphox/guruduno/main/{file_name}"
    response = requests.get(url)

    if response.status_code == 200:
        with open(file_name, "wb") as f:
            f.write(response.content)

            print(f"File {file_name} downloaded successfully.") # print a confirmation message
    else:
        print(f"Request failed with status code {response.status_code}.") # print an error message

    loader = UnstructuredMarkdownLoader(file_name)
    documents = loader.load()
    markdown_splitter = MarkdownTextSplitter(chunk_size=750, chunk_overlap=0)
    docs = markdown_splitter.split_documents(documents)

    embeddings = OpenAIEmbeddings()

    return Pinecone.from_documents(docs, embeddings, index_name="uno-rules")
