import React from "react";
import "./index.scss";

function Modal({ body, opened }) {
    return(
        <>
            <div className={`modal`}>
                <div className={`content relative p-5 pt-9`}>
                    <button onClick={() => opened(false)} className="absolute right-2 top-2">
                        <span className="material-icons-outlined">
                            close
                        </span>
                    </button>
                    { body }
                </div>
            </div>
        </>
    );
}

export default Modal;
