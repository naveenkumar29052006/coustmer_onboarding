import React from "react";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/userlist")}
      className="px-4 py-2 bg-[#534DAF] text-white rounded hover:bg-[#3e388c] transition font-semibold"
    >
      User List
    </button>
  );
};

export default UserList; 
