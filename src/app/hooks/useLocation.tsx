import * as React from "react";
import { useLocation } from "react-router";
type Props = {
  width: number;
};

const Location = (props: Props) => {
  const [position, setPosition] = React.useState<number>(0);
  let location = useLocation();
  React.useEffect(() => {
    switch (location.pathname) {
      case "/":
        setPosition(0);
        console.log(location.pathname);
        break;
      case "/wallet":
        setPosition(props.width / 3);
        console.log(location.pathname);
        break;
      default:
        setPosition(props.width - props.width / 3);
        console.log(location.pathname);

        break;
    }
  }, [location]);
  return position;
};

export default Location;
