import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonTabButton,
  isPlatform,
} from "@ionic/react";
import { home } from "ionicons/icons";

const HouseButton: React.FC = () => {
  return (
    <IonTabButton tab="home" href="/home">
      <IonIcon aria-hidden="true" icon={home} />
    </IonTabButton>
  );
};

export default HouseButton;
