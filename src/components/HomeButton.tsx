import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonTabButton,
  useIonRouter,
} from "@ionic/react";
import { home, mic, stop } from "ionicons/icons";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./HomeButton.css";

const MicButton: React.FC = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <HouseButton />;
  }

  const handleTouchStart = () => {
    SpeechRecognition.startListening({ language: "pt-BR" });
  };

  const handleTouchEnd = () => {
    if (!listening) return;

    SpeechRecognition.stopListening();
    resetTranscript();

    alert(transcript);
  };

  return (
    <IonFab horizontal="center" vertical="bottom" slot="fixed">
      <IonFabButton
        color={listening ? "danger" : "primary"}
        className={listening ? "listening" : ""}
        onPointerDown={handleTouchStart}
        onPointerUp={handleTouchEnd}
        onPointerLeave={handleTouchEnd}
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
