import { Route, Routes } from "react-router";
import "./App.css";
import ApiProvider from "./contexts/ApiProvider";
import FlashProvider from "./contexts/FlashProvider";
import FlashMessage from "./core/components/FlashMessage";
import ItemExport from "./ItemExport";
import ItemForm from "./ItemForm";
import ItemImport from "./ItemImport";
import ItemList from "./ItemList";

function App() {
  return (
    <FlashProvider>
      <ApiProvider>
        <FlashMessage />
        <Routes>
          <Route path="" element={<ItemList />} />
          <Route path="/new" element={<ItemForm />} />
          <Route path="/edit/:id" element={<ItemForm />} />
          <Route path="/import" element={<ItemImport />} />
          <Route path="/export" element={<ItemExport />} />
        </Routes>
      </ApiProvider>
    </FlashProvider>
  );
}

export default App;
