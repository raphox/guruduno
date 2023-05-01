import { useIonRouter } from "@ionic/react";
import HouseButton from "./HouseButton";
import MicButton from "./MicButton";

import "./HomeButton.css";

interface HomeButtonProps {
  home?: boolean;
}

const HomeButton: React.FC<HomeButtonProps> = ({ home }) => {
  const router = useIonRouter();

  if (home && router.routeInfo.pathname !== "/home") {
    return <HouseButton />;
  } else if (router.routeInfo.pathname === "/home") {
    return <MicButton />;
  } else {
    return null;
  }
};

export default HomeButton;
