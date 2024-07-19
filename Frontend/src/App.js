// import React, { useEffect } from "react";
// import axios from "axios";
// import {useSelector} from 'react-redux'
// import { Routes, Route, Link } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";
// import Register from "./components/Register";
// import Login from "./components/Login";
// import Dashboard from "./components/Dashboard";
// import Category from "./components/Category/Category";  
// import Subcategory from './components/SubCategory/SubCategory';  
// import Products from "./components/Product/Product";  
// import PrivateRoute from "./components/PrivateRoute";
// import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";
// import { IoPersonCircleOutline } from "react-icons/io5";
// import { IoHomeOutline } from "react-icons/io5";
// import { BiCategoryAlt } from "react-icons/bi";
// import { MdSubject } from "react-icons/md";
// import { IoCubeOutline } from "react-icons/io5";
// import EditCategory from "./components/Category/EditCategory";
// import AddCategory from "./components/Category/AddCategory";
// import Unauthorized from "./components/UnAuthorized";
// import AddSubcategory from "./components/SubCategory/AddSubCategory";
// import AddProduct from "./components/Product/AddProduct";
// import EditSubCategory from "./components/SubCategory/EditSubCategory";
// import ViewProduct from "./components/Product/ViewProduct";
// import ResetPassword from "./components/ResetPassword";
// function App() {
//   const { user, handleLogin, handleLogout } = useAuth();
//   const email = useSelector((state) => state.forgot.email);
//   useEffect(() => {
//     if (localStorage.getItem('token')) {
//       (async () => {
//         try {
//           const response = await axios.get('http://localhost:3456/account', {
//             headers: {
//               Authorization: localStorage.getItem('token'),
//             },
//           });
//           handleLogin(response.data);
//         } catch (error) {
//           console.error('Error fetching user:', error);
//         }
//       })();
//     }
//   }, []);

//   return (
//     <div className="App">
//       <Navbar style={{ backgroundColor: "#BFB9FA",color: "white" }} light expand="md">
//         <NavbarBrand href="/">Table Sprint</NavbarBrand>
//         <Nav className="mr-auto" navbar>
//           {!user ? (
//             <>
//               <NavItem>
//                 <NavLink tag={Link} to='/register'>Register</NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink tag={Link} to='/login'>Login</NavLink>
//               </NavItem>
//             </>
//           ) : (
//             <>
//               <NavItem>
//                 <NavLink tag={Link} to='/dashboard'><IoHomeOutline/> Dashboard</NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink tag={Link} to='/category'><BiCategoryAlt/>Category</NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink tag={Link} to='/subcategory'><MdSubject/>Subcategory</NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink tag={Link} to='/products'><IoCubeOutline/>Products</NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink
//                   href="#"
//                   onClick={() => {
//                     localStorage.removeItem('token');
//                     handleLogout();
//                   }}
//                 >
//                  <IoPersonCircleOutline/>
//                 </NavLink>
//               </NavItem>
//             </>
//           )}
//         </Nav>
//       </Navbar>

//       <Routes>
//         <Route path='/unauthorized' element={<Unauthorized/>}/>
      
//         <Route path='/register' element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/dashboard" element={<PrivateRoute permittedRoles={['admin']}><Dashboard/></PrivateRoute>} />
//         <Route path="/category" element={<PrivateRoute permittedRoles={['admin']}><Category/></PrivateRoute>} />
//         <Route path='add-category' element={<PrivateRoute permittedRoles={['admin']}><AddCategory/></PrivateRoute>}/>
//         <Route path='/edit-category/:id' element={<PrivateRoute permittedRoles={['admin']}><EditCategory/></PrivateRoute>}/>
//         <Route path="/subcategory" element={<PrivateRoute permittedRoles={['admin']}><Subcategory/></PrivateRoute>} />
//         <Route path='/edit-subcategory/:id' element={<PrivateRoute permittedRoles={['admin']}><EditSubCategory/></PrivateRoute>}/>
//         <Route path="/add-subcategory" element={<PrivateRoute permittedRoles={['admin']}><AddSubcategory/></PrivateRoute>}/>
//         <Route path="/products" element={<PrivateRoute permittedRoles={['admin']}><Products/></PrivateRoute>} />
//         <Route path="/add-product" element={<PrivateRoute permittedRoles={['admin']}><AddProduct/></PrivateRoute>} />
//         <Route path="/view-product/:id" element={<PrivateRoute permittedRoles={['admin']}><ViewProduct/></PrivateRoute>}/>
//         {email.length > 0 && <Route path='/reset-password' element={<ResetPassword />} />}
//       </Routes>
//     </div>
//   );
// }

// export default App;



import React, { useEffect } from "react";
import axios from "axios";
import { useSelector } from 'react-redux'
import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Category from "./components/Category/Category";
import Subcategory from './components/SubCategory/SubCategory';
import Products from "./components/Product/Product";
import PrivateRoute from "./components/PrivateRoute";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { MdOutlineAnalytics } from "react-icons/md";
import { GrCatalog } from "react-icons/gr";
import { MdSubject } from "react-icons/md";
import { MdProductionQuantityLimits } from "react-icons/md";
import EditCategory from "./components/Category/EditCategory";
import AddCategory from "./components/Category/AddCategory";
import Unauthorized from "./components/UnAuthorized";
import AddSubcategory from "./components/SubCategory/AddSubCategory";
import AddProduct from "./components/Product/AddProduct";
import EditSubCategory from "./components/SubCategory/EditSubCategory";
import ViewProduct from "./components/Product/ViewProduct";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import './Navbar.css'; // Import the CSS file

function App() {
  const { user, handleLogin, handleLogout } = useAuth();
  const email = useSelector((state) => state.forgot.email);
  useEffect(() => {
    if (localStorage.getItem('token')) {
      (async () => {
        try {
          const response = await axios.get('http://localhost:3456/account', {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          });
          handleLogin(response.data);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      })();
    }
  }, []);

  return (
    <div className="App">
      <Navbar className="navbar" light expand="md">
        <NavbarBrand href="/">Table Sprint</NavbarBrand>
        <Nav className="mr-auto" navbar>
          {!user ? (
            <>
              <NavItem>
                <NavLink tag={Link} to='/register'>Register</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to='/login'>Login</NavLink>
              </NavItem>
            </>
          ) : (
            <>
              <NavItem>
                <NavLink tag={Link} to='/dashboard' activeClassName="active"><MdOutlineAnalytics /> Dashboard</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to='/category' activeClassName="active"><GrCatalog /> Category</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to='/subcategory' activeClassName="active"><MdSubject /> Subcategory</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to='/products' activeClassName="active"><MdProductionQuantityLimits /> Products</NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="#"
                  onClick={() => {
                    localStorage.removeItem('token');
                    handleLogout();
                  }}
                >
                  <RiLogoutCircleRLine />
                </NavLink>
              </NavItem>
            </>
          )}
        </Nav>
      </Navbar>

      <Routes>
        <Route path='/unauthorized' element={<Unauthorized />} />

        <Route path='/register' element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute permittedRoles={['admin']}><Dashboard /></PrivateRoute>} />
        <Route path="/category" element={<PrivateRoute permittedRoles={['admin']}><Category /></PrivateRoute>} />
        <Route path='add-category' element={<PrivateRoute permittedRoles={['admin']}><AddCategory /></PrivateRoute>} />
        <Route path='/edit-category/:id' element={<PrivateRoute permittedRoles={['admin']}><EditCategory /></PrivateRoute>} />
        <Route path="/subcategory" element={<PrivateRoute permittedRoles={['admin']}><Subcategory /></PrivateRoute>} />
        <Route path='/edit-subcategory/:id' element={<PrivateRoute permittedRoles={['admin']}><EditSubCategory /></PrivateRoute>} />
        <Route path="/add-subcategory" element={<PrivateRoute permittedRoles={['admin']}><AddSubcategory /></PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute permittedRoles={['admin']}><Products /></PrivateRoute>} />
        <Route path="/add-product" element={<PrivateRoute permittedRoles={['admin']}><AddProduct /></PrivateRoute>} />
        <Route path="/view-product/:id" element={<PrivateRoute permittedRoles={['admin']}><ViewProduct /></PrivateRoute>} />
        {email.length > 0 && <Route path='/reset-password' element={<ResetPassword />} />}
      </Routes>
    </div>
  );
}

export default App;

