// module imports
import React from "react";
import { useNavigate } from "react-router-dom";

// icon import
import backBtn from "../assets/images/back btn.png";

// animation import
import Cloud from "./Cloud";

const UnitContainer = ({ unitId, unitText }) => {
  const navigate = useNavigate();
  const getUnitText = unitText();

  return (
    <div>
      <div>
        <Cloud />
      </div>
      <p>
        <img
          src={backBtn}
          alt="backBtn"
          onClick={() => {
            navigate("/dashboard");
          }}
        />
        {unitId && <h2>Unit {unitId}</h2>}
      </p>
      {unitText && <p>{getUnitText}</p>}
    </div>
  );
};

export default UnitContainer;
