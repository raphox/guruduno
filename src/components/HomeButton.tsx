import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonTabButton,
  useIonRouter,
  isPlatform,
} from "@ionic/react";
import { home, mic, stop } from "ionicons/icons";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./HomeButton.css";
import { useStore } from "../store";
import { useEffect, useState } from "react";

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

const HouseButton: React.FC = () => {
  return (
    <IonTabButton tab="home" href="/home">
      <IonIcon aria-hidden="true" icon={home} />
    </IonTabButton>
  );
};

interface HomeButtonProps {
  home?: boolean;
}

const HomeButton: React.FC<HomeButtonProps> = ({ home }) => {
  const router = useIonRouter();

  if (home && router.routeInfo.pathname !== "/home") {
    return <HouseButton />;
  } else if (router.routeInfo.pathname === "/home") {
    return <MicButton />;
  } else {
    return null;
  }
};

export default HomeButton;
