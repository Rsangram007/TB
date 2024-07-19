// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
// import { FaRegEdit } from "react-icons/fa";
// import { MdOutlineDeleteOutline } from "react-icons/md";
// import { useNavigate } from "react-router-dom";

// const Category = () => {
//   const navigate = useNavigate();
//   const [categories, setCategories] = useState([]);
//   const [modal, setModal] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get("http://localhost:3456/category", {
//         headers: {
//           Authorization: localStorage.getItem("token"),
//         },
//       });
//       // Sort categories based on sequence number
//       const sortedCategories = response.data.sort((a, b) => a.sequence - b.sequence);
//       setCategories(sortedCategories);
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//     }
//   };

//   const toggleModal = () => setModal(!modal);

//   const handleEdit = (id) => {
//     navigate(`/edit-category/${id}`);
//   };

//   const handleAdd = () => {
//     navigate("/add-category");
//   };

//   const handleDelete = async () => {
//     try {
//       if (deleteId) {
//         await axios.delete(`http://localhost:3456/category/${deleteId}`, {
//           headers: {
//             Authorization: localStorage.getItem("token"),
//           },
//         });
//         // After successful deletion, update the categories state
//         setCategories(categories.filter((category) => category._id !== deleteId));
//         console.log("Category deleted successfully");
//         toggleModal(); // Close the modal after deletion
//       }
//     } catch (err) {
//       console.error("Error deleting category:", err);
//     }
//   };

//   const openDeleteModal = (id) => {
//     setDeleteId(id);
//     toggleModal();
//   };

//   return (
//     <div>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h1 className="text-center">Category-{categories.length}</h1>
//         <button className="btn btn-primary" onClick={handleAdd}>
//           Add Category
//         </button>
//       </div>
//       {categories.length !== 0 ? (
//         <Table hover border={2}>

//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Category Name</th>
//               <th>Image</th>
//               <th>Status</th>
//               <th>Sequence</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {categories.map((category) => (
//               <tr key={category._id}>
//                 <td>{category._id}</td>
//                 <td>{category.categoryName}</td>
//                 <td>
//                   <img
//                     src={`http://localhost:3456/${category.image}`} // Assuming `category.image` is the URL of the image
//                     alt={category.categoryName} // Alt text for accessibility
//                     style={{ maxWidth: "100px", maxHeight: "100px" }} // Example styling
//                   />
//                 </td>
//                 <td>{category.status}</td>
//                 <td>{category.sequence}</td>
//                 <td>
//                   <button onClick={() => handleEdit(category._id)} className="btn btn-primary">
//                     <FaRegEdit />
//                   </button>
//                   <button onClick={() => openDeleteModal(category._id)} className="btn btn-danger">
//                     <MdOutlineDeleteOutline />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>

//         </Table>
//       ) : (
//         <p className="text-center">No Categories Found</p>
//       )}

//       <Modal isOpen={modal} toggle={toggleModal}>
//         <ModalHeader toggle={toggleModal}>Confirm Delete</ModalHeader>
//         <ModalBody>Are you sure you want to delete this category?</ModalBody>
//         <ModalFooter>
//           <Button color="danger" onClick={handleDelete}>
//             Delete
//           </Button>{" "}
//           <Button color="secondary" onClick={toggleModal}>
//             Cancel
//           </Button>
//         </ModalFooter>
//       </Modal>
//     </div>
//   );
// };

// export default Category;



import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import './Category.css'; // Import the CSS file

const Category = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3456/category", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      // Sort categories based on sequence number
      const sortedCategories = response.data.sort((a, b) => a.sequence - b.sequence);
      setCategories(sortedCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const toggleModal = () => setModal(!modal);

  const handleEdit = (id) => {
    navigate(`/edit-category/${id}`);
  };

  const handleAdd = () => {
    navigate("/add-category");
  };

  const handleDelete = async () => {
    try {
      if (deleteId) {
        await axios.delete(`http://localhost:3456/category/${deleteId}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        // After successful deletion, update the categories state
        setCategories(categories.filter((category) => category._id !== deleteId));
        console.log("Category deleted successfully");
        toggleModal(); // Close the modal after deletion
      }
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    toggleModal();
  };

  return (
    <div className="category-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="text-center">Category - {categories.length}</h1>
        <button className="btn btn-primary" onClick={handleAdd}>
          Add Category
        </button>
      </div>
      {categories.length !== 0 ? (
        <Table hover bordered className="category-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category Name</th>
              <th>Image</th>
              <th>Status</th>
              <th>Sequence</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category._id}</td>
                <td>{category.categoryName}</td>
                <td>
                  <img
                    src={`http://localhost:3456/${category.image}`} // Assuming `category.image` is the URL of the image
                    alt={category.categoryName} // Alt text for accessibility
                    className="category-image"
                  />
                </td>
                <td>{category.status}</td>
                <td>{category.sequence}</td>
                <td>
                  <button onClick={() => handleEdit(category._id)} className="btn btn-primary">
                    <FaRegEdit />
                  </button>
                  <button onClick={() => openDeleteModal(category._id)} className="btn btn-danger">
                    <MdOutlineDeleteOutline />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-center">No Categories Found</p>
      )}

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Confirm Delete</ModalHeader>
        <ModalBody>Are you sure you want to delete this category?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDelete}>
            Delete
          </Button>{" "}
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Category;
