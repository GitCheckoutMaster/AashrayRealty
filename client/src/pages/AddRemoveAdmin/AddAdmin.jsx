import React, { useState } from "react";
import { addAdmin } from "../../utils/api";

const AddAdmin = () => {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleClick = async () => {
    const res = addAdmin(email, localStorage.getItem("access_token"));
    console.log(res);
  };

  return (
      <div className="addAdmin">
        <input type="text" placeholder="Enter email" onChange={handleChange} />
        <button onClick={handleClick}>Add Admin</button>
      </div>
    )
};

export default AddAdmin; 
