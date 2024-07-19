import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, FormGroup, Label, Input, Col, Card, CardBody, CardHeader } from "reactstrap";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryName: "",
    subCategory: "",
    productName: "",
    image: null, // Changed from productImage to image
    sequence: 0, // Default value for sequence
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [serverError, setServerError] = useState("");

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
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubcategories = async (categoryName) => {
    try {
      const response = await axios.get(`http://localhost:3456/sub-category?categoryName=${categoryName}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setSubcategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const validationSchema = Yup.object().shape({
    categoryName: Yup.string().required("Category is required"),
    subCategory: Yup.string().required("Subcategory Name is required"),
    productName: Yup.string().required("Product Name is required"),
    image: Yup.mixed().required("Product Image is required"),
    sequence: Yup.number().required("Sequence is required").integer("Sequence must be an integer"),
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));

      if (name === "categoryName") {
        fetchSubcategories(value); // Fetch subcategories when category changes
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });

      const formDataToSend = new FormData();
      formDataToSend.append("categoryName", formData.categoryName);
      formDataToSend.append("subCategory", formData.subCategory);
      formDataToSend.append("productName", formData.productName);
      formDataToSend.append("image", formData.image);
      formDataToSend.append("sequence", formData.sequence);

      const response = await axios.post("http://localhost:3456/product", formDataToSend, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });
      //console.log(response.data);

      toast.success("Product added successfully");
      setFormData({
        categoryName: "",
        subCategory: "",
        productName: "",
        image: null,
        sequence: 0,
      });
      navigate("/products");
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // Yup validation error
        const errors = {};
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        setValidationErrors(errors);
        setServerError("");
      } else {
        // Other errors (e.g., network errors, server errors)
        console.error("Error adding product:", error);
        setServerError("Failed to add product. Please try again later.");
        setValidationErrors({});
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Card style={{ width: "400px" }}>
        <CardHeader className="text-center">Add Product</CardHeader>
        <CardBody>
          {serverError && <p className="text-danger">{serverError}</p>}
          <form onSubmit={handleSubmit}>
            <FormGroup row>
              <Label for="categoryName" sm={4}>
                Category
              </Label>
              <Col sm={8}>
                <Input
                  type="select"
                  id="categoryName"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.categoryName}>
                      {category.categoryName}
                    </option>
                  ))}
                </Input>
                {validationErrors.categoryName && <p className="text-danger">{validationErrors.categoryName}</p>}
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="subCategory" sm={4}>
                Subcategory
              </Label>
              <Col sm={8}>
                <Input
                  type="select"
                  id="subCategory"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory._id} value={subcategory.subCategory}>
                      {subcategory.subCategory}
                    </option>
                  ))}
                </Input>
                {validationErrors.subCategory && <p className="text-danger">{validationErrors.subCategory}</p>}
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="productName" sm={4}>
                Product Name
              </Label>
              <Col sm={8}>
                <Input
                  type="text"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="Enter Product Name"
                />
                {validationErrors.productName && <p className="text-danger">{validationErrors.productName}</p>}
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="image" sm={4}>
                Product Image
              </Label>
              <Col sm={8}>
                <Input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleChange}
                />
                {validationErrors.image && <p className="text-danger">{validationErrors.image}</p>}
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col sm={{ size: 8, offset: 4 }}>
                <Button type="submit" color="primary">
                  Add Product
                </Button>
              </Col>
            </FormGroup>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddProduct;
