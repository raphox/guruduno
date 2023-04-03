import typer

from rich import print
from dotenv import load_dotenv
from ask import execute as ask_execute
from query import upsert_question, execute as query_execute

load_dotenv()


app = typer.Typer()

@app.command()
def reindex():
    from reindex import execute as reindex_execute

    reindex_execute()

@app.command()
def query(question: str = typer.Option(None, help="Question about how to play Uno.")):
    if question is None:
        question = typer.prompt("what is your doubt?")

    similarity_search = query_execute(question)

    print(similarity_search)


@app.callback(invoke_without_command=True)
def main(ctx: typer.Context):
    if ctx.invoked_subcommand is not None:
        return

    question = typer.prompt("what is your doubt?")
    similarity_search = query_execute(question, k=1, namespace="questions")

    if similarity_search:
        document, score = similarity_search[0]

        if score > 0.95:
            print(document.metadata['answer'])
            return

    print("Sending your message to chat...")

    answer = ask_execute(question)

    upsert_question(question, answer.content)

    print("Your answer is:")
    print(answer.content)


if __name__ == "__main__":
    app()
