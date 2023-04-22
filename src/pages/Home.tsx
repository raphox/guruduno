import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Home.css";
import { Question, NewQuestion } from "../components/Question";
import { useStore } from "../store";

const Home: React.FC = () => {
  const { state } = useStore();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Guruduno</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {state.questions.map((question) =>
            question.id === "new" ? (
              <NewQuestion key="new" {...question} />
            ) : (
              question.title && <Question key={question.id} {...question} />
            )
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
