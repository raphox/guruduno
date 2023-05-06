import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonTextarea,
  IonRow,
} from "@ionic/react";
import { useTranslation } from "react-i18next";
import { volumeHighOutline, stop, paperPlane, trash } from "ionicons/icons";
import { useState, useEffect } from "react";
import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
import ContentLoader from "react-content-loader";
import { Question as QuestionType, useStore } from "../store";
import db from "../database";

const PlayButton: React.FC<{ text: string; disabled: boolean }> = ({
  text,
  disabled,
}) => {
  const { t, i18n } = useTranslation();
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
      utterance.lang = i18n.language;
      utterance.rate = 0.8;

      synth.speak(utterance);
    }
  };

  return (
    <IonRow class="ion-justify-content-end">
      <IonButton fill="clear" disabled={disabled} onClick={togglePlay}>
        {playing ? (
          <>
            <IonIcon slot="start" icon={stop}></IonIcon>
            {t("message.stop")}
          </>
        ) : (
          <>
            <IonIcon slot="start" icon={volumeHighOutline}></IonIcon>
            {t("message.play")}
          </>
        )}
      </IonButton>
    </IonRow>
  );
};

const NewQuestion: React.FC<QuestionType> = (data) => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { state, dispatch } = useStore();
  const { title } = state.newQuestion;

  useEffect(() => {
    dispatch({
      type: "UPDATE_NEW_QUESTION",
      payload: { id: "new", title: data.title },
    });
  }, [data.title]);

  const removeQuestion = () => {
    dispatch({
      type: "REMOVE_QUESTION",
      payload: { id: "new", ...data },
    });
  };

  const addQuestion = async () => {
    setIsLoading(true);

    const title = state.newQuestion.title;

    try {
      const docRef = await addDoc(collection(db, "questions"), {
        title: state.newQuestion.title,
        language: i18n.language,
      });

      removeQuestion();
      setIsLoading(false);

      onSnapshot(doc(db, "questions", docRef.id), (doc) => {
        dispatch({
          type: "UPDATE_QUESTION",
          payload: { id: doc.id, ...doc.data() } as QuestionType,
        });
      });

      dispatch({
        type: "ADD_QUESTION",
        payload: { id: docRef.id, title },
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      setIsLoading(false);
    }
  };

  const handleChange = (event: Event) => {
    const value = (event.target as HTMLInputElement).value as string;

    dispatch({
      type: "UPDATE_NEW_QUESTION",
      payload: { id: "new", title: value },
    });
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonTextarea
          label={t("message.label") as string}
          labelPlacement="floating"
          fill="solid"
          placeholder={t("message.placeholder") as string}
          value={title}
          autoGrow={true}
          counter={true}
          maxlength={250}
          onIonInput={handleChange}
        ></IonTextarea>
      </IonCardHeader>

      <IonCardContent></IonCardContent>

      <IonRow class="ion-justify-content-end">
        <IonButton
          fill="clear"
          disabled={!title || isLoading}
          onClick={addQuestion}
        >
          <IonIcon slot="start" icon={paperPlane}></IonIcon>
          {t("message.send")}
        </IonButton>
        <IonButton fill="clear" disabled={isLoading} onClick={removeQuestion}>
          <IonIcon slot="start" icon={trash}></IonIcon>
          {t("message.cancel")}
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

      <PlayButton disabled={!answer} text={`${title}\n\n\n${answer}`} />
    </IonCard>
  );
};

export { Question, NewQuestion };
