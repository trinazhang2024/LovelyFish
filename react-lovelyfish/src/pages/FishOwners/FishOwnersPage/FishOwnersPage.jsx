import React from "react";
import FishOwnerForm from "../FishOwnerForm/FishOwnerForm";
import FishOwnersList from "../FishOwnersList/FishOwnersList";
import "./FishOwnersPage.css";

function FishOwnersPage() {
  const [refreshList, setRefreshList] = useState(false);

  // Refresh the list whenever the form submits new data
  const handleAdded = () => {
    setRefreshList((prev) => !prev); // 
  };

  return (
    <div className="fish-owners-page">
      <h1>Fish Owners Community</h1>

      <section>
        <FishOwnerForm onAdded={handleAdded} />
      </section>

      <section>
        <FishOwnersList refresh={refreshList} />
      </section>
    </div>
  );
}

export default FishOwnersPage;