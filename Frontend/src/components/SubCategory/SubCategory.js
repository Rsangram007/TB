import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const SubCategory = () => {
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState([]);
  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3456/sub-category", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      // Sort subCategories based on sequence number
      const sortedSubCategories = response.data.sort((a, b) => a.sequence - b.sequence);
      setSubCategories(sortedSubCategories);
    } catch (err) {
      console.error("Error fetching subCategories:", err);
    }
  };

  const toggleModal = () => setModal(!modal);

  const handleAdd = () => {
    navigate("/add-subcategory");
  };
  const handleEdit = (id) => {
    navigate(`/edit-subcategory/${id}`);
  };

  const handleDelete = async () => {
    try {
      if (deleteId) {
        await axios.delete(`http://localhost:3456/sub-category/${deleteId}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        // After successful deletion, update the subCategories state
        setSubCategories(subCategories.filter((subCategory) => subCategory._id !== deleteId));
        console.log("SubCategory deleted successfully");
        toggleModal(); // Close the modal after deletion
      }
    } catch (err) {
      console.error("Error deleting subCategory:", err);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    toggleModal();
  };
  

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="text-center">SubCategory-{subCategories.length}</h1>
        <button className="btn btn-primary" onClick={handleAdd}>
          Add SubCategory
        </button>
      </div>
      {subCategories.length !== 0 ? (
        <Table hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>SubCategory</th>
              <th>Category</th>
              <th>Image</th>
              <th>Status</th>
              <th>Sequence</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subCategories.map((subCategory) => (
              <tr key={subCategory._id}>
                <td>{subCategory._id}</td>
                <td>{subCategory.subCategory}</td>
                <td>{subCategory.categoryName}</td>
                <td>
                  <img
                    src={`http://localhost:3456/${subCategory.image}`} // Assuming `subCategory.image` is the URL of the image
                    alt={subCategory.subCategory} // Alt text for accessibility
                    style={{ maxWidth: "100px", maxHeight: "100px" }} // Example styling
                  />
                </td>
                <td>{subCategory.status}</td>
                <td>{subCategory.sequence}</td>
                <td>
                  <button onClick={()=>handleEdit(subCategory._id)}className="btn btn-primary">
                    <FaRegEdit />
                  </button>
                  <button onClick={() => openDeleteModal(subCategory._id)} className="btn btn-danger">
                    <MdOutlineDeleteOutline />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No SubCategories Found</p>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Confirm Delete</ModalHeader>
        <ModalBody>Are you sure you want to delete this subcategory?</ModalBody>
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

export default SubCategory;
