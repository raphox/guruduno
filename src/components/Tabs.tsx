import { Redirect, Route } from "react-router-dom";
import {
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  useIonRouter,
} from "@ionic/react";
import { newspaper, helpBuoy } from "ionicons/icons";
import About from "../pages/About";
import Home from "../pages/Home";
import Rules from "../pages/Rules";

import HomeButton from "./HomeButton";

const Tabs: React.FC = () => {
  const router = useIonRouter();

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/about">
          <About />
        </Route>
        <Route path="/home">
          <Home />
        </Route>
        <Route exact path="/rules">
          <Rules />
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="rules" href="/rules">
          <IonIcon aria-hidden="true" icon={newspaper} />
        </IonTabButton>

        <IonTabButton
          tab="home"
          href="/home"
          disabled={router.routeInfo.pathname === "/home"}
        >
          <HomeButton home={true} />
        </IonTabButton>

        <IonTabButton tab="about" href="/about">
          <IonIcon aria-hidden="true" icon={helpBuoy} />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
