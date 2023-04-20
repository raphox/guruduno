import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import ReactMarkdown from "react-markdown";
import docs from "../docs.json";
import "./About.css";

const about = docs["pt-BR"]["about"];

const About: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{about["title"]}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{about["title"]}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <ReactMarkdown children={about["body"]} linkTarget="_blank" />
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default About;
