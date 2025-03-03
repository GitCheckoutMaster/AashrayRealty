import React, { useState } from "react";
import { addAdmin } from "../../utils/api";
import "./AddAdminStyle.css";
import { toast } from "react-toastify";

const AddAdmin = () => {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleClick = async () => {
    const res = await addAdmin(email, localStorage.getItem("access_token"));
    console.log(res);
    if (res.status === 200) {
      toast.success("Admin added successfully", {
        position: "bottom-right"
      });
    }
  };

  return (
      <div className="addAdmin">
        <input type="text" placeholder="Enter email" onChange={handleChange} />
        <button className="button" onClick={handleClick}>Add Admin</button>
      </div>
    )
};

export default AddAdmin; 
