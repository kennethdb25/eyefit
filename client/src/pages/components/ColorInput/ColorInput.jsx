import React, { useState } from "react";
import { Input, Tag } from "antd";

const ColorInput = ({ value = [], onChange }) => {
  const [inputValue, setInputValue] = useState("");

  const addColor = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      const newColors = [...value, trimmed];
      onChange?.(newColors);
      setInputValue("");
    }
  };

  const removeColor = (removedColor) => {
    const newColors = value.filter((color) => color !== removedColor);
    onChange?.(newColors);
  };

  return (
    <div
      className="flex items-center flex-wrap gap-2 p-2 border rounded-md"
      style={{
        minHeight: 40,
        borderColor: "#d9d9d9",
        cursor: "text",
      }}
      onClick={(e) => {
        e.currentTarget.querySelector("input")?.focus();
      }}
    >
      {value.map((color) => (
        <Tag
          key={color}
          closable
          onClose={() => removeColor(color)}
          style={{
            backgroundColor: color,
            color: "#fff",
            padding: "4px 8px",
            borderRadius: "12px",
          }}
        >
          {color}
        </Tag>
      ))}
      <Input
        bordered={false}
        placeholder={value.length === 0 ? "Type a color and press Enter" : ""}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onPressEnter={addColor}
        style={{ flex: 1, minWidth: 120 }}
      />
    </div>
  );
};

export default ColorInput;
