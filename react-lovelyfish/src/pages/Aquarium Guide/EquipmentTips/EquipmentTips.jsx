// EquipmentTips.jsx
import React from "react";
import './EquipmentTips.css';

function EquipmentTips() {
  return (
    <div className="equipment-tips">
      <h1>🛠 Equipment Tips</h1>
      <section>
        <h2>My Aquarium Tools</h2>
        <p>
          Here you can describe how to use your aquarium equipment: filters, heaters, nets, pumps, etc.
          Include tips, precautions, and maintenance advice.
        </p>
      </section>
      <section>
        <h2>Maintenance Tips</h2>
        <p>
          Explain cleaning schedules, water testing, and replacement of consumables. 
          Add images or diagrams if needed.
        </p>
      </section>
    </div>
  );
}

export default EquipmentTips;
