import React from "react";

function FileUpload({ onFileSelectSuccess }) {
  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    onFileSelectSuccess(files);
  };

  return (
    <input
      type="file"
      onChange={handleFileInput}
      multiple
      style={{
        padding: "10px",
        border: "1px solid #ddd",
        display: "block",
        margin: "10px 0",
        width: "calc(50% - 22px)",
      }}
    />
  );
}

export default FileUpload;
