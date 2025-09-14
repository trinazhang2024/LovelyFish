import React,{ useState }  from "react";
import { Link } from "react-router-dom";
import FishOwnerForm from "../FishOwnerForm/FishOwnerForm";
import FishOwnersList from "../FishOwnersList/FishOwnersList";
import { useUser } from "../../../contexts/UserContext";
import "./FishOwnersPage.css";

function FishOwnersPage() {
  const { user, userLoading } = useUser();
  const [refreshList, setRefreshList] = useState(false);

  // Refresh the list whenever the form submits new data
  const handleAdded = () => {
    setRefreshList((prev) => !prev); // 
  };

  if (userLoading) return <p>Loading...</p>;

  if (!user) {
    return (
      <div className="login-prompt">
        <p>Please log in to view the Community.</p>
        <Link to="/login"><button>Login</button></Link>
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    );
  }

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