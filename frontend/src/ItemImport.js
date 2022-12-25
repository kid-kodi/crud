import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useApi } from "./contexts/ApiProvider";
import { useFlash } from "./contexts/FlashProvider";

const uploadSchema = Yup.object().shape({});

export default function InvoiceImportPage() {
  const navigate = useNavigate();
  const api = useApi();
  const flash = useFlash();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      excelFile: null,
    },
    validationSchema: uploadSchema,
    onSubmit: async (values) => {
      if (values.excelFile) {
        let data = new FormData();
        values.excelFile && data.append("excelFile", values.excelFile);
        const response = await api.post(`/items/import`, data);
        if (!response.error) {
          flash("Chargement de données effectuées", "success");
          navigate("/");
        } else {
          flash(`${response.error}`);
        }
      } else {
        flash("choisir un fichier", "danger");
      }
    },
  });

  return (
    <div className="page">
      <div className="header">
        <h1>Importer des données</h1>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <input
          id="excelFile"
          name="excelFile"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          type="file"
          onChange={(event) => {
            formik.setFieldValue("excelFile", event.currentTarget.files[0]);
          }}
        />

        <button type="submit">Charger</button>
        <Link to="/">Annuler</Link>
      </form>
    </div>
  );
}
