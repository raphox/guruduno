import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ReactMarkdown from "react-markdown";
import docs from "../docs.json";
import "./Rules.css";

const rules = docs["pt-BR"]["rules"];

const Rules: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{rules["title"]}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{rules["title"]}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <ReactMarkdown children={rules["body"]} linkTarget="_blank" />
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default Rules;
