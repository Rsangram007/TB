import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, FormGroup, Label, Input, Col, Card, CardBody, CardHeader } from "reactstrap";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

export default function AddSubcategory() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryName: "",
    subCategory: "",
    sequence: "",
    image: null,
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

  const validationSchema = Yup.object().shape({
    categoryName: Yup.string().required("Category is required"),
    subCategory: Yup.string().required("Subcategory Name is required"),
    sequence: Yup.number().integer("Sequence must be an integer").typeError('Sequence must be a number').required("Sequence is required"),
    image: Yup.mixed().required("Image is required"),
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });

      const formDataToSend = new FormData();
      formDataToSend.append("categoryName", formData.categoryName);
      formDataToSend.append("subCategory", formData.subCategory);
      formDataToSend.append("sequence", formData.sequence);
      formDataToSend.append("image", formData.image);

      const response = await axios.post("http://localhost:3456/sub-category", formDataToSend, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Subcategory added successfully");
      setFormData({
        categoryName: "",
        subCategory: "",
        sequence: "",
        image: null,
      });
      setTimeout(()=>{
        navigate("/subcategory");
      },4000)
      
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
        console.error("Error adding subcategory:", error);
        setServerError("Failed to add subcategory. Please try again later.");
        setValidationErrors({});
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Card style={{ width: "400px" }}>
        <CardHeader className="text-center">Add Subcategory</CardHeader>
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
                Subcategory Name
              </Label>
              <Col sm={8}>
                <Input
                  type="text"
                  id="subCategory"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  placeholder="Enter Subcategory Name"
                />
                {validationErrors.subCategory && <p className="text-danger">{validationErrors.subCategory}</p>}
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="sequence" sm={4}>
                Sequence
              </Label>
              <Col sm={8}>
                <Input
                  type="number"
                  id="sequence"
                  name="sequence"
                  value={formData.sequence}
                  onChange={handleChange}
                  placeholder="Enter Sequence"
                />
                {validationErrors.sequence && <p className="text-danger">{validationErrors.sequence}</p>}
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="image" sm={4}>
                Image
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
                  Add Subcategory
                </Button>
              </Col>
            </FormGroup>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
