import React, { DetailedHTMLProps, InputHTMLAttributes, useRef } from "react";
import styles from "../../styles/RangeInput.module.scss";

const RangeInput = ({
  height,
  barClass,
  barWidth = "100%",
  barThumbSize = "15px",
  onChange,
  value,
  ...props
}: RangeInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`${styles.bar} rangeBar ${barClass}`}>
      <div className={styles.sliderLeftShadow} style={{
        width: `calc((${barWidth} - ${barThumbSize}) * ${value})`
        // left: `calc(-${barWidth})`,
      }} />
      <input {...props} title="volume" ref={inputRef} type="range" min="0" max="1" step="0.01" value={value}
             onChange={onChange} className={styles.input} />
    </div>
  );
};

export default RangeInput;

export interface RangeInputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  barClass?: string,
  barWidth?: string,
  barThumbSize?: string,
}
