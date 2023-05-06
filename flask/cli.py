import typer

from enum import Enum
from rich import print
from dotenv import load_dotenv
from ask import execute as ask_execute
from query import upsert_question, execute as query_execute

load_dotenv()


class LanguageEnum(str, Enum):
    pt_BR = "pt-BR"
    en_US = "en-US"


app = typer.Typer()


@app.command()
def reindex():
    from reindex import execute as reindex_execute

    reindex_execute("pt-BR")
    reindex_execute("en-US")


@app.command()
def query(language: LanguageEnum = typer.Option("pt-BR"), question: str = typer.Option(None, help="Question about how to play Uno.")):
    if question is None:
        question = typer.prompt(f"what is your doubt? ({language}) ")

    similarity_search = query_execute(question, f"{language}_rules")

    print(similarity_search)


@app.callback(invoke_without_command=True)
def main(ctx: typer.Context, language: LanguageEnum = typer.Option("pt-BR"), skip_similar_questions: bool = typer.Option(False)):
    if ctx.invoked_subcommand is not None:
        return

    question = typer.prompt(f"what is your doubt? ({language}) ")
    similar_questions = query_execute(
        question, f"{language}_questions", k=1) if not skip_similar_questions else None

    if similar_questions:
        document, score = similar_questions[0]

        if score > 0.95:
            print(document.metadata['answer'])
            return

    print("Sending your message to chat...")

    answer = ask_execute(question, language)

    upsert_question(question, answer.content, language)

    print("Your answer is:")
    print(answer.content)


if __name__ == "__main__":
    app()
