import { Title, Svg } from ".";
import external from "../../../public/assets/external.svg";

type Props = {
  traitSurfer: (e: any) => Promise<void>;
};

export const TopBar = (props: Props) => {
  return (
    <>
      <Title>
        <div>Trait Surfer</div>
        <Svg src={external} alt="" onClick={props.traitSurfer} />
      </Title>
    </>
  );
};
