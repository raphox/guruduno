import { IonSelect, IonSelectOption } from "@ionic/react";
import { useTranslation } from "react-i18next";

import "./LanguageSelect.css";

const LanguageSelect: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <IonSelect
      interface="popover"
      class="ion-padding-end"
      className="language-select"
      value={i18n.language}
      onIonChange={(e) => i18n.changeLanguage(e.detail.value)}
    >
      <IonSelectOption value="pt-BR">Português</IonSelectOption>
      <IonSelectOption value="en-US">English</IonSelectOption>
    </IonSelect>
  );
};

export default LanguageSelect;
