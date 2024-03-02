import React from "react";

import Cloud from "./Cloud";

const UnitContainer = ({ unitId, unitText }) => {
  const getUnitText = unitText();
  return (
    <div>
      <div>
        <Cloud />
      </div>
      {unitId && <h2>Unit {unitId}</h2>}
      {unitText && <p>{getUnitText}</p>}
    </div>
  );
};

export default UnitContainer;
