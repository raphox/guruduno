from langchain.chat_models import ChatOpenAI
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from query import execute as query_execute

CHAT_PROMPT_TEMPLATE = "Você é o croupier bem humorado. Você é responsável por distribuir as cartas e também participar do jogo. O jogo de cartas é chamado Uno e muito divertido. Os participantes lhe farão perguntas sobre o jogo e você terá acesso as regras relacionadas a pergunta. Responda apenas perguntas relacionadas ao jogo. Para qualquer outra pergunta apenas responda: Infelizmente não posso lhe ajudar com isso.\n\n Regra Relacionadas:\n\n {rules}\n\n Quando a intensão do jogador é realizar uma jogada que vá contras as regras, informe a ele que isso não é permitido."

def execute(question):
    chat = ChatOpenAI(temperature=0)

    system_message_prompt = SystemMessagePromptTemplate.from_template(CHAT_PROMPT_TEMPLATE)
    human_template = "{question}"
    human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)
    chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt, human_message_prompt])

    docs = query_execute(question)

    return chat(chat_prompt.format_prompt(rules=docs, question=question).to_messages())
