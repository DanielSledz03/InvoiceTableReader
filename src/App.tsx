import React, { useState, useCallback } from "react";
import FileUpload from "./components/FileUpload/FileUpload.tsx";

function App() {
  const localStorageDataKey = "appData";
  const initialData = JSON.parse(
    localStorage.getItem(localStorageDataKey) || "[]"
  );

  const [data, setData] = useState<string[][]>(initialData);
  const [deletedRow, setDeletedRow] = useState<{
    index: number;
    row: string[];
  } | null>(null);

  const saveDataToLocalStorage = useCallback((dataToSave) => {
    localStorage.setItem(localStorageDataKey, JSON.stringify(dataToSave));
  }, []);

  const parseFiles = useCallback(
    (files: FileList) => {
      const tempData = [];
      let filesProcessed = 0;

      const processFileContent = (text: string): string[][] => {
        return text
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .split("\n")
          .filter((row, index) => index > 2 && row.trim() !== "")
          .map((row) => {
            const columns = row.split("\t");
            return columns.length > 13
              ? [columns[0], columns[5], columns[10], columns[13]]
              : null;
          })
          .filter((row): row is string[] => row !== null);
      };

      Array.from(files).forEach((file) => {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target) {
            const text = e.target.result as string;
            const parsedData: string[][] = processFileContent(text);
            tempData.push(...(parsedData as unknown as string[][]));
          }
          filesProcessed += 1;

          if (filesProcessed === files.length) {
            const newData = [...data, ...tempData];
            setData(newData);
            saveDataToLocalStorage(newData);
          }
        };

        reader.readAsText(file, "ISO-8859-2");
      });
    },
    [data, saveDataToLocalStorage]
  );
  const handleDeleteRow = useCallback(
    (indexToDelete) => {
      const newData = data.filter((_, index) => index !== indexToDelete);
      setDeletedRow({ index: indexToDelete, row: data[indexToDelete] });
      setData(newData);
      saveDataToLocalStorage(newData);
    },
    [data, saveDataToLocalStorage]
  );

  const handleDoubleClick = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Nie udało się skopiować tekstu: ", error);
    }
  };

  const handleRestoreLastDeletedRow = useCallback(() => {
    if (deletedRow) {
      const newData = [...data];
      newData.splice(deletedRow.index, 0, deletedRow.row);
      setData(newData);
      saveDataToLocalStorage(newData);
      setDeletedRow(null);
    }
  }, [data, deletedRow, saveDataToLocalStorage]);

  const handleDeleteAllRows = useCallback(() => {
    const isConfirmed = window.confirm(
      "Czy na pewno chcesz usunąć ten wiersz?"
    );
    if (isConfirmed) {
      setData([]);
      saveDataToLocalStorage([]);
    }
  }, [saveDataToLocalStorage]);

  console.log(data.length);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 10,
        }}
      >
        <FileUpload onFileSelectSuccess={parseFiles} />
        <button
          className="button "
          style={{ height: 40 }}
          onClick={handleRestoreLastDeletedRow}
          disabled={!deletedRow}
        >
          Przywróć ostatnio usunięty wiersz
        </button>

        <button
          className="button delete"
          onClick={handleDeleteAllRows}
          disabled={data.length === 0}
          style={{ height: 40 }}
        >
          Usuń wszystkie wiersze
        </button>
      </div>

      <div>
        <table>
          <thead>
            <tr>
              <th>LP</th>
              <th>Nabywca</th>
              <th>NIP</th>
              <th>Brutto</th>
              <th>Czy usunąć?</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                {row.map(
                  (cell: string, cellIndex: number) =>
                    cellIndex !== 0 && (
                      <td
                        onDoubleClick={() => handleDoubleClick(cell)}
                        key={cellIndex}
                      >
                        {cell}
                      </td>
                    )
                )}
                <td style={{ textAlign: "center" }}>
                  <button
                    className="button"
                    onClick={() => handleDeleteRow(index)}
                  >
                    USUŃ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
