import {
  IonButtons,
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
import LanguageSelect from "../components/LanguageSelect";

const Home: React.FC = () => {
  const { state, dispatch } = useStore();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Guruduno</IonTitle>
          <IonButtons slot="end">
            <LanguageSelect />
          </IonButtons>
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
