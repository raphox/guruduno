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

import "./Rules.css";

const Rules: React.FC = () => {
  const { t } = useTranslation();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t("rules.title")}</IonTitle>
          <IonButtons slot="end">
            <LanguageSelect />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{t("rules.title")}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <ReactMarkdown children={t("rules.body")} linkTarget="_blank" />
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default Rules;
