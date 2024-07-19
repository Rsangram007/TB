// import { useAuth } from "../context/AuthContext";
// import { GiCube } from "react-icons/gi";

// export default function Dashboard() {
//   const { user } = useAuth();

//   return (
//     <div>
//         <h1 className="text-center">Dashboard</h1>
        
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "50vh", // Ensure the component takes at least the full viewport height
//       }}
//     >
      
//       <h2>
//         <GiCube /> Table Sprint
//       </h2>
//       <p>Hey {user.username}, Welcome to Table Sprint Admin</p>
//     </div>


//     </div>
    
//   );
// }
import React from 'react';
import { useAuth } from "../../context/AuthContext";
import { GiAndroidMask } from "react-icons/gi";
import './Dashboard.css'; // Import the CSS file

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <h1 className="text-center">Dashboard</h1>
      <div className="dashboard-content">
        <h2>
          <GiAndroidMask /> Table Sprint
        </h2>
        <p>Hey {user.username}, Welcome to Table Sprint Admin</p>
      </div>
    </div>
  );
}
