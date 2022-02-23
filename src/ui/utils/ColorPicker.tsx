import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import { ColorResult, SketchPicker } from "react-color";
import reactCSS from "reactcss";
import "./ColorPicker.scss";

interface ColorPickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [display, setDisplay] = useState<boolean>(false);
  const [color, setColor] = useState<string>(value);

  const handleClick = () => {
    setDisplay(!display);
  };

  const handleClose = useCallback(() => {
    setDisplay(false);
    onChange(color);
  }, [color, onChange]);

  const handleChange = (newColor: ColorResult) => {
    setColor(newColor.hex);
  };

  const applyColor = useCallback(() => {
    onChange(color);
  }, [color, onChange]);

  useEffect(() => {
    applyColor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color]);

  const styles = reactCSS({
    default: {
      color: {
        width: "100%",
        height: "16px",
        borderRadius: "2px",
        backgroundColor: color,
      },
      swatch: {
        width: "50%",
        padding: "5px",
        background: "transparent",
        border: "1px solid #434343",
        borderRadius: "1px",
        boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
        display: "inline-block",
        cursor: "pointer",
      },
      popover: {
        position: "fixed",
        zIndex: "2",
      },
      cover: {
        position: "fixed",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    },
  });

  return (
    <div className="color-picker">
      <div style={styles.swatch} onClick={handleClick}>
        <div style={styles.color} />
      </div>
      <div className="display-value">{color}</div>
      {display ? (
        <div style={styles.popover as CSSProperties}>
          <div style={styles.cover as CSSProperties} onClick={handleClose} />
          <SketchPicker
            color={color}
            onChange={handleChange}
            disableAlpha={true}
            presetColors={[
              "#000000",
              "#444444",
              "#888888",
              "#CCCCCC",
              "#FFFFFF",
              "#FF0000",
              "#00FF00",
              "#0000FF",
              "#FFFF00",
              "#00FFFF",
              "#FF00FF",
            ]}
          />
        </div>
      ) : null}
    </div>
  );
}
