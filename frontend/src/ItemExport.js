import React from "react";
import * as FileSaver from "file-saver";
import { Link } from "react-router-dom";
import XLSX from "sheetjs-style";
import { useApi } from "./contexts/ApiProvider";

export default function ItemExport() {
  const api = useApi();

  const ExportToExcel = ({ excelData, fileName }) => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,charset-UTF-8";
    const fileExtension = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const loadData = async (e) => {
    e.preventDefault();
    const response = await api.get(`/items/export`);
    if (!response.error) {
      if (!response.error) {
        ExportToExcel({ excelData: response, fileName: "items" });
      } else {
        console.log("Hello");
      }
    }
  };

  return (
    <div className="page">
      <div className="header">
        <h1>Exporter les données</h1>
      </div>
      <div className="main">
        <div className="panel">
          <h3 className="layout-center">
            Cliquer sur exporter pour avoir vos données sous excel
          </h3>
          <div className="layout-center">
            <button className="btn" onClick={loadData}>
              Exporter
            </button>
            <Link className="btn" to="/">
              Annuler
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
