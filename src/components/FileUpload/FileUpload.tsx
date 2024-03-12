import React from "react";

function FileUpload({ onFileSelectSuccess }) {
  const handleFileInput = (e) => {
    // Obsługuje przesyłane pliki jako tablicę
    const files = Array.from(e.target.files);
    onFileSelectSuccess(files);
  };

  return (
    <input
      type="file"
      onChange={handleFileInput}
      multiple // Pozwala na wybór wielu plików
      style={{
        padding: "10px",
        border: "1px solid #ddd",
        display: "block",
        margin: "10px 0",
        width: "calc(50% - 22px)", // 10px padding on both sides and 1px border
      }}
    />
  );
}

export default FileUpload;
