import { IonFab, IonFabButton, IonIcon, isPlatform } from "@ionic/react";
import { mic, stop } from "ionicons/icons";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useEffect, useState } from "react";
import { useStore } from "../store";
import HouseButton from "./HouseButton";
import "./HomeButton.css";

const MicButton: React.FC = () => {
  const [message, setMessage] = useState("");
  const [previousMessage, setPreviousMessage] = useState(message);
  const {
    transcript,
    finalTranscript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <HouseButton />;
  }

  const { state, dispatch } = useStore();

  useEffect(() => {
    if (!state.newQuestion.title) {
      setMessage("");
      setPreviousMessage("");
      resetTranscript();
    }
  }, [state.newQuestion]);

  useEffect(() => {
    document.querySelector("ion-content")?.scrollToTop();

    if (message) {
      dispatch({
        type: "ADD_QUESTION",
        payload: { id: "new", title: message, answer: undefined },
      });
    }
  }, [message]);

  useEffect(() => {
    setMessage(`${previousMessage} ${transcript}`.trim());
  }, [transcript]);

  useEffect(() => {
    let tmpFinalTranscript = finalTranscript;

    if (tmpFinalTranscript.startsWith(transcript)) {
      tmpFinalTranscript = tmpFinalTranscript.slice(transcript.length);
    }

    const finalMessage = `${previousMessage} ${tmpFinalTranscript}`;

    setMessage(finalMessage.trim());
    setPreviousMessage(finalMessage.trim());
  }, [finalTranscript]);

  const handleTouchStart = () => {
    SpeechRecognition.startListening({ language: "pt-BR", continuous: true });
  };

  const handleTouchEnd = () => {
    SpeechRecognition.stopListening();
  };

  let pointerEvents = {};

  if (isPlatform("mobile") || isPlatform("mobileweb")) {
    pointerEvents = {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    };
  } else {
    pointerEvents = {
      onPointerDown: handleTouchStart,
      onPointerUp: handleTouchEnd,
    };
  }

  return (
    <IonFab horizontal="center" vertical="bottom" slot="fixed">
      <IonFabButton
        color={listening ? "danger" : "primary"}
        className={listening ? "listening" : ""}
        {...pointerEvents}
      >
        <IonIcon icon={listening ? stop : mic}></IonIcon>
      </IonFabButton>
    </IonFab>
  );
};

export default MicButton;
