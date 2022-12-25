import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApi } from "./contexts/ApiProvider";
import { useFlash } from "./contexts/FlashProvider";

const ItemList = () => {
  const query = useLocation().search;
  const navigate = useNavigate();
  const api = useApi();
  const flash = useFlash();

  const [items, setItems] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);

  const handleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((itemId) => itemId !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(items.map((item) => item._id));
    } else {
      setSelected([]);
    }
  };

  const deleteMultipleItem = async () => {
    if (window.confirm("Voulez vous supprimez ?") === true) {
      const response = await api.post(`/items/more`, selected);
      if (!response.error) {
        setItems(items.filter((item) => !selected.includes(item._id)));
      }
    }
  };
  const deleteItem = async (id) => {
    if (window.confirm("Voulez vous supprimez ?") === true) {
      const response = await api.delete(`/items/${id}`);
      if (!response.error) {
        setItems(items.filter((item) => item._id !== id));
      }
    }
  };

  useEffect(() => {
    (async () => {
      const response = await api.get(`/items/paginate${query}`);
      if (!response.error) {
        setItems(response.items);
        setPages(response.pages);
        setPage(response.page);
      } else {
        flash(`${response.error}`, "danger");
      }
    })();
  }, [query, api, flash]);

  return (
    <div>
      <h1>Liste d'article</h1>
      <Link to="/new">Créer un article</Link>
      <Link to="/import">Import</Link>
      <Link to="/export">Export</Link>
      <button disabled={selected.length === 0} onClick={deleteMultipleItem}>
        Supprimer selection
      </button>
      <div>
        <input
          type="text"
          placeholder="Rechercher"
          onChange={(e) => navigate(`?q=${e.target.value}`)}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>
              <input type="checkbox" onChange={handleSelectAll} />
            </th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item) => (
            <tr key={item._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selected.includes(item._id)}
                  onChange={() => handleSelect(item._id)}
                />
              </td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>
                <Link to={`/edit/${item._id}`}>Modifier</Link>
                <button onClick={() => deleteItem(item._id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {pages && (
          <div className="flex items-center justify-center my-4">
            {[...Array(pages)].map((p, i) => (
              <Link
                className={`border px-4 py-2 ${p === page ? "" : null}`}
                key={i}
                to={`?page=${i + 1}`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemList;
