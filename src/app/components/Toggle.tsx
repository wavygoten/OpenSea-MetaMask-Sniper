import styled from "@emotion/styled";
import { useSwitch } from "@mui/base/SwitchUnstyled";
import clsx from "clsx";

const BasicSwitchRoot = styled("span")`
  font-size: 0;
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  background: var(--secondary-light);
  border-radius: 10px;
  cursor: pointer;

  &.Switch-disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &.Switch-checked {
    background: var(--button-theme);
  }
`;

const BasicSwitchInput = styled("input")`
  cursor: inherit;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 1;
  margin: 0;
`;

const BasicSwitchThumb = styled("span")`
  display: block;
  width: 14px;
  height: 14px;
  top: 3px;
  left: 3px;
  border-radius: 16px;
  background-color: #9197a7;
  position: relative;
  transition: all 200ms ease;

  &.Switch-focusVisible {
    background-color: var(--secondary-light);
    box-shadow: 0 0 1px 8px rgba(0, 0, 0, 0.25);
  }

  &.Switch-checked {
    left: 22px;
    top: 3px;
    background-color: #fff;
  }
`;

export function BasicSwitch(props: any) {
  const { getInputProps, checked, disabled, focusVisible } = useSwitch(props);

  const stateClasses = {
    "Switch-checked": checked,
    "Switch-disabled": disabled,
    "Switch-focusVisible": focusVisible,
  };

  return (
    <BasicSwitchRoot className={clsx(stateClasses)}>
      <BasicSwitchThumb className={clsx(stateClasses)} />
      <BasicSwitchInput {...getInputProps()} />
    </BasicSwitchRoot>
  );
}
