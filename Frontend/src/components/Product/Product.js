import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3456/product", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      // Sort products based on sequence number
      const sortedProducts = response.data.sort((a, b) => a.sequence - b.sequence);
      setProducts(sortedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const toggleModal = () => setModal(!modal);

  const handleAdd = () => {
    navigate("/add-product");
  };
  const handleView=(id)=>{
    navigate(`/view-product/${id}`)
  }

  const handleDelete = async () => {
    try {
      if (deleteId) {
        await axios.delete(`http://localhost:3456/product/${deleteId}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        // After successful deletion, update the products state
        setProducts(products.filter((product) => product._id !== deleteId));
        console.log("Product deleted successfully");
        toggleModal(); // Close the modal after deletion
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    toggleModal();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="text-center">Product</h1>
        <button className="btn btn-primary" onClick={handleAdd}>
          Add Product
        </button>
      </div>
      {products.length !== 0 ? (
        <Table hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>SubCategory</th>
              <th>Category</th>
              <th>Image</th>
              <th>Status</th>
              <th>Sequence</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.product}</td>
                <td>{product.subCategory}</td>
                <td>{product.categoryName}</td>
                <td>
                  <img
                    src={`http://localhost:3456/${product.image}`} // Assuming `product.image` is the URL of the image
                    alt={product.categoryName} // Alt text for accessibility
                    style={{ maxWidth: "100px", maxHeight: "100px" }} // Example styling
                  />
                </td>
                <td>{product.status}</td>
                <td>{product.sequence}</td>
                <td>
                  <button onClick={()=>handleView(product._id)}className="btn btn-primary">
                    <IoEyeOutline />
                  </button>
                  <button onClick={() => openDeleteModal(product._id)} className="btn btn-danger">
                    <MdOutlineDeleteOutline />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-center">No Products Found</p>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Confirm Delete</ModalHeader>
        <ModalBody>Are you sure you want to delete this product?</ModalBody>
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

export default Product;
