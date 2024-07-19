import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardBody, CardHeader } from "reactstrap";

export default function ViewProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3456/product/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        console.log(response.data);
        setProduct(response.data); // Store fetched product data in state
      } catch (err) {
        console.log(err);
      }
    };

    fetchProduct();
  }, [id]); // Dependency on id to re-fetch product data when id changes

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Card>
            <CardHeader tag="h5" className="text-center">
              Product Details
            </CardHeader>
            <CardBody>
              <p><strong>Category Name:</strong> {product.categoryName}</p>
              <p><strong>Product Name:</strong> {product.productName}</p>
              <p><strong>Subcategory:</strong> {product.subCategory}</p>
              <p><strong>Sequence:</strong> {product.sequence}</p>
              <p><strong>Status:</strong> {product.status}</p>
              <p><strong>Created At:</strong> {new Date(product.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(product.updatedAt).toLocaleString()}</p>
              <p><strong>Image:</strong> <br /><img src={`http://localhost:3456/${product.image}`} alt="Product" style={{ maxWidth: '20%' }} /></p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
