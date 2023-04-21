import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonInput,
  IonItem,
  IonRow,
} from "@ionic/react";
import { volumeHighOutline, stop, paperPlane, trash } from "ionicons/icons";
import { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import ContentLoader from "react-content-loader";
import { Question as QuestionType, useStore } from "../store";
import db from "../database";

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
    <IonRow class="ion-justify-content-end">
      <IonButton fill="clear" onClick={togglePlay}>
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
    </IonRow>
  );
};

const NewQuestion: React.FC<QuestionType> = (data) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(data.title);
  const { dispatch } = useStore();

  useEffect(() => {
    setTitle(data.title);
    setIsLoading(data.id != "new" && !data.answer);
  }, [data.title]);

  const addQuestion = async () => {
    dispatch({
      type: "REMOVE_QUESTION",
      payload: { id: "new", title: "" },
    });

    const docRef = await addDoc(collection(db, "questions"), {
      title,
    });
  };

  const removeQuestion = () => {
    dispatch({
      type: "REMOVE_QUESTION",
      payload: { id: "new", ...data },
    });
  };

  const handleChange = (event: Event) => {
    const value = (event.target as HTMLInputElement).value as string;

    setTitle(value);
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonInput
          label="Sua Pergunta"
          labelPlacement="floating"
          fill="solid"
          placeholder="Faça sua pergunta"
          value={title}
          onIonInput={handleChange}
        ></IonInput>
      </IonCardHeader>

      <IonCardContent></IonCardContent>

      <IonRow class="ion-justify-content-end">
        <IonButton fill="clear" disabled={!title} onClick={addQuestion}>
          <IonIcon slot="start" icon={paperPlane}></IonIcon>
          Enviar pergunta
        </IonButton>
        <IonButton fill="clear" onClick={removeQuestion}>
          <IonIcon slot="start" icon={trash}></IonIcon>
          Cancelar
        </IonButton>
      </IonRow>
    </IonCard>
  );
};

const Question: React.FC<QuestionType> = ({ title, answer }) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>{title}</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        {answer || (
          <ContentLoader
            speed={2}
            width={340}
            height={84}
            viewBox="0 0 340 84"
            backgroundColor="rgba(200, 200, 200, 0.2)"
            foregroundColor="#ecebeb"
          >
            <rect x="0" y="0" rx="3" ry="3" width="67" height="11" />
            <rect x="76" y="0" rx="3" ry="3" width="140" height="11" />
            <rect x="109" y="47" rx="3" ry="3" width="53" height="11" />
            <rect x="169" y="47" rx="3" ry="3" width="72" height="11" />
            <rect x="0" y="47" rx="3" ry="3" width="100" height="11" />
            <rect x="0" y="71" rx="3" ry="3" width="37" height="11" />
            <rect x="0" y="22" rx="3" ry="3" width="140" height="11" />
            <rect x="148" y="22" rx="3" ry="3" width="155" height="11" />
          </ContentLoader>
        )}
      </IonCardContent>

      <PlayButton text={`${title}\n\n\n${answer}`} />
    </IonCard>
  );
};

export { Question, NewQuestion };
