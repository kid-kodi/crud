import React, { useEffect, useState } from "react";
import { useApi } from "./contexts/ApiProvider";
import { useFlash } from "./contexts/FlashProvider";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";

const ItemSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
});

export default function ItemForm() {
  const api = useApi();
  const flash = useFlash();
  const navigate = useNavigate();
  const { id } = useParams();

  const [item, setItem] = useState({});

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: item?.name || "",
      description: item?.description || "",
    },
    validationSchema: ItemSchema,
    onSubmit: async (values) => {
      if (!id) {
        const response = await api.post(`/items`, values);
        if (!response.error) {
          flash("Nouvelle item créer", "success");
          navigate("/");
        } else {
          flash(`${response.error}`, "danger");
        }
      } else {
        const response = await api.put(`/items/${item._id}`, values);
        if (!response.error) {
          flash("Mise á jour effectuée", "success");
          navigate("/");
        } else {
          flash(`${response.error}`, "danger");
        }
      }
    },
  });

  useEffect(() => {
    (async () => {
      if (id) {
        const response = await api.get(`/items/${id}`);
        if (!response.error) {
          setItem(response);
        }
      }
    })();
  }, [id, api]);

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="name">Nom</label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          {formik.errors.name && formik.touched.name ? (
            <div>{formik.errors.name}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            id="description"
            name="description"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.description}
          />
        </div>
        <Link to="/">Annuler</Link>
        <button>Enregistrer</button>
      </form>
    </div>
  );
}
