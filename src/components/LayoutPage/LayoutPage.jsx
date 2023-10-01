import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss";

function LayoutPage(props) {
  const route = useNavigate();
  const {
    title,
    subtitle,
    bodyStyle,
    icon,
    background,
    header,
    body,
    backButton
  } = props;

  return (
    <div className={`w-full container-patients flex flex-col items-center justify-start`}>
      <div
        className={`toolbar header-default mobile-flex-column !pt-9 stick-header flex flex-col items-center w-full justify-center`}
        style={{ background: background }}
      >
        <div className={`flex justify-between items-center w-full max-w-[1320px]`}>
          <div className="toolbar-header flex justify-between items-center w-full">
            <div className="w-full flex items-start">
              {icon ? (
                <span
                  className="mt-1 mr-2 material-icons-outlined cursor-pointer text-white"
                >
                  { icon }
                </span>
              ) : null}
              <h2 className="text-xl font-bold mb-4 text-white flex-col justify-start">
                {title}
                {subtitle ? (
                  <div>

                    <span className="subtitle text-white">{subtitle}</span>
                  </div>
                ) : null}
              </h2>
            </div>
            { backButton && <div className={`flex justify-center items-center`} onClick={() => route('/home')}>
                <span className="mr-2 material-icons-outlined cursor-pointer text-white">
                  keyboard_backspace
                </span>
                <span className="text-white cursor-pointer">Voltar</span>
              </div>
            }
          </div>
        </div>
      </div>
      
      <div className="w-full pl-5 pr-5 mb-5 flex items-center justify-center">
        <div className="toolbar-content relative w-full">
          <div>
            <div className="card-header mobile-flex-column">
              {header}
            </div>
            <div className="card-body">
              <div className="w-full overflow-auto" style={{ bodyStyle }}>
                {body}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LayoutPage;
