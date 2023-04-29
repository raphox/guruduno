import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";

import LanguageSelect from "../components/LanguageSelect";

import "./About.css";

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t("about.title")}</IonTitle>
          <IonButtons slot="end">
            <LanguageSelect />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{t("about.title")}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <ReactMarkdown children={t("about.body")} linkTarget="_blank" />
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default About;
