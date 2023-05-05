from langchain.chat_models import ChatOpenAI
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.schema import AIMessage
from query import execute as query_execute

CHAT_WITHOUT_ANSWER = {
    "en-US": "I'm sorry, I can't help you with that.",
    "pt-BR": "Infelizmente não posso lhe ajudar com isso."
}

CHAT_PROMPT_TEMPLATE = {
    "en-US": ''.join((
        "You are the croupier humorous. You are responsible for distributing cards and also participating in the game. ",
        "The card game is called Uno and is very diverting. The players will ask you about the game and you will have access to the rules related to the question. ",
        "Answer only questions related to the game. For any other question, answer: ",
        CHAT_WITHOUT_ANSWER["en-US"],
        "\n\nRules Related:\n{rules}",
        "\n\nWhen the intensity of the player is performing a move that violates the rules, inform him that this is not allowed."
    )),
    "pt-BR": ''.join((
        "Você é o croupier bem humorado. Você é responsável por distribuir as cartas e também participar do jogo. ",
        "O jogo de cartas é chamado Uno e é muito divertido. Os participantes lhe farão perguntas sobre o jogo e você terá acesso as regras relacionadas à pergunta. ",
        "Responda apenas perguntas relacionadas ao jogo. Para qualquer outra pergunta apenas responda: ",
        CHAT_WITHOUT_ANSWER["pt-BR"],
        "\n\nRegra Relacionadas:\n{rules}",
        "\n\nQuando a intensão do jogador for realizar uma jogada que vá contras as regras, informe a ele que isso não é permitido."
    ))
}


def execute(question, language="en-US"):
    docs = query_execute(question)
    document, score = [None, 0] if not docs else docs[0]

    if score < 0.8:
        return AIMessage(content=CHAT_WITHOUT_ANSWER)

    chat = ChatOpenAI(temperature=0)

    system_message_prompt = SystemMessagePromptTemplate.from_template(
        CHAT_PROMPT_TEMPLATE[language]
    )

    human_message_prompt = HumanMessagePromptTemplate.from_template(
        "{question}"
    )

    chat_prompt = ChatPromptTemplate.from_messages(
        [system_message_prompt, human_message_prompt]
    )

    return chat(chat_prompt.format_prompt(rules=docs, question=question).to_messages())
