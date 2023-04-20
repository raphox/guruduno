import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonItem,
} from "@ionic/react";
import { volumeHighOutline, stop } from "ionicons/icons";
import { useState } from "react";

const PlayButton: React.FC<{ text: string }> = ({ text }) => {
  const browserSupportsSpeechSynthesis = "speechSynthesis" in window;

  if (!browserSupportsSpeechSynthesis) {
    return null;
  }

  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();

  utterance.onstart = () => setPlaying(true);
  utterance.onend = () => setPlaying(false);

  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);

      synth.cancel();
    } else {
      utterance.text = text;
      utterance.lang = "pt-BR";
      utterance.rate = 0.8;

      synth.speak(utterance);
    }
  };

  return (
    <IonItem>
      <IonButton fill="clear" slot="end" onClick={togglePlay}>
        {playing ? (
          <>
            <IonIcon slot="start" icon={stop}></IonIcon>
            Parar reprodução
          </>
        ) : (
          <>
            <IonIcon slot="start" icon={volumeHighOutline}></IonIcon>
            Reproduzir
          </>
        )}
      </IonButton>
    </IonItem>
  );
};

const Question: React.FC = () => {
  const { title, answer } = {
    title:
      "O que acontece se alguém esquece de dizer “uno” quando fica com uma carta na mão?",
    answer:
      "De acordo com as regras oficiais do jogo, se outro jogador perceber e gritar “uno” antes do próximo jogador jogar sua carta, o jogador que esqueceu deve comprar duas cartas da pilha. Se ninguém perceber, o jogo continua normalmente.",
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>{title}</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>{answer}</IonCardContent>

      <PlayButton text={`${title}\n\n\n${answer}`} />
    </IonCard>
  );
};

export default Question;
