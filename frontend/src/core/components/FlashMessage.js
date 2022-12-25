import { useContext } from "react";
import { FlashContext } from "../../contexts/FlashProvider";

export default function FlashMessage() {
  const { flashMessage, visible, hideFlash } = useContext(FlashContext);

  return (
    <div>
      {visible && (
        <div className={`absolute bottom-2 right-2 ${flashMessage.type}`}>
          <div className="text-center px-10 py-5 bg-blue-200 text-blue-500 rounded-xl">
            <h1>{flashMessage.message}</h1>
          </div>
          <div onClick={hideFlash}></div>
        </div>
      )}
    </div>
  );
}
