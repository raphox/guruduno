import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Home.css";
import Question from "../components/Question";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Guruduno</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {Array(10)
            .fill(undefined)
            .map((item, i) => (
              <Question key={i} />
            ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
