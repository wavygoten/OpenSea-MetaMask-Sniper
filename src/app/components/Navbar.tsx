import * as React from "react";
import { BsGear } from "react-icons/bs";
import { Row, Svg, TabIndicator } from ".";
import openseablue from "../../../public/assets/opensea-white.svg";
import wallet from "../../../public/assets/wallet.svg";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [active, setActive] = React.useState<number>(0);
  const [transform, setTransform] = React.useState<number>();

  let navigate = useNavigate();

  React.useEffect(() => {
    switch (active) {
      case 0:
        setTransform(0);
        break;
      case 1:
        setTransform(239 / 3);
        break;
      case 2:
        setTransform(239 - 239 / 3);
        break;
      default:
        break;
    }
  }, [active]);
  return (
    <>
      <TabIndicator
        css={`
          transform: translateX(${transform}px);
        `}
      />
      <Row
        css={`
          margin: 0px;
          justify-content: center;
          align-items: center;
          background-color: var(--secondary-dark);
          width: 100%;
          div {
            display: flex;
            justify-content: center;
            width: calc(100% / 3);
            cursor: pointer;
            padding: 0.5rem 0;
            opacity: 0.8;
          }
          div:hover {
            background-color: var(--main-dark);
            transition: 300ms;
            opacity: 1;
          }
          div.active {
            background-color: var(--main-dark);
            opacity: 1;
          }
        `}
      >
        {" "}
        <div
          className={active === 0 ? "active" : ""}
          onClick={() => {
            setActive(0);
            navigate("/");
          }}
        >
          <Svg src={openseablue} alt="" />
        </div>
        <div
          className={active === 1 ? "active" : ""}
          onClick={() => {
            setActive(1);
            navigate("/wallet");
          }}
        >
          <Svg src={wallet} alt="" />
        </div>
        <div
          className={active === 2 ? "active" : ""}
          onClick={() => {
            setActive(2);
            navigate("/settings");
          }}
        >
          <BsGear color="white" size={20} />
        </div>
      </Row>
    </>
  );
};
