import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, FormGroup, Label, Input, Col, Card, CardBody, CardHeader } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

export default function EditSubCategory() {
  const navigate = useNavigate();
  const { id } = useParams(); // Extracting id from URL params
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryName: "",
    subCategory: "",
    sequence: "",
    image: null,
    status: "", // Default status value
  });
  const [currentImage, setCurrentImage] = useState(null); // State to store current image
  const [currentImageUrl, setCurrentImageUrl] = useState(""); // State to store current image URL
  const [currentSubCategory, setCurrentSubCategory] = useState(""); // State to store current subcategory
  const [validationErrors, setValidationErrors] = useState({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchCategoryDetails();
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
      const response = await axios.get(`http://localhost:3456/sub-category`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setSubcategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const fetchCategoryDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3456/sub-category/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      console.log(response.data);
      const { categoryName, sequence, status, image, subCategory } = response.data;
      setFormData({
        categoryName,
        sequence,
        status,
        image: image,
        subCategory: subCategory,
      });
      setCurrentImage(image); // Set current image in state
      setCurrentSubCategory(subCategory); // Set current subcategory in state
      if (image) {
        // Assuming the API returns a direct URL to the image
        setCurrentImageUrl(`http://localhost:3456/${image}`);
      }
      if (categoryName) {
        fetchSubcategories(categoryName); // Fetch subcategories for the selected category
      }
    } catch (error) {
      console.error("Error fetching category details:", error);
    }
  };

  const validationSchema = Yup.object().shape({
    categoryName: Yup.string().required("Category Name is required"),
    subCategory: Yup.string().required("Subcategory is required"),
    sequence: Yup.number()
      .integer("Sequence must be an integer")
      .typeError("Sequence must be a number")
      .required("Sequence is required"),
    status: Yup.string().required("Status is required"),
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      // Handle image separately to avoid setting a default value when not selected
      if (e.target.files.length > 0) {
        setFormData({ ...formData, image: e.target.files[0] });
      } else {
        // If no file selected, set image to null or undefined
        setFormData({ ...formData, image: null });
      }
    } else {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });

      // Fetch subcategories when category changes
      if (name === "categoryName") {
        fetchSubcategories(value);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Validate form data using Yup schema
      await validationSchema.validate(formData, { abortEarly: false });
  
      // Prepare request headers with authorization token
      const headers = {
        Authorization: localStorage.getItem("token"),
      };
  
      let response;
  
      // If image is selected, send multipart form data
      if (formData.image) {
        const formDataToSend = new FormData();
        formDataToSend.append("categoryName", formData.categoryName);
        formDataToSend.append("subCategory", formData.subCategory);
        formDataToSend.append("sequence", formData.sequence);
        formDataToSend.append("status", formData.status);
        formDataToSend.append("image", formData.image);
  
        // Send PUT request with multipart form data
        response = await axios.put(
          `http://localhost:3456/sub-category/${id}`,
          formDataToSend,
          { headers }
        );
      } else {
        // Send PUT request with JSON data
        const jsonData = {
          categoryName: formData.categoryName,
          subCategory: formData.subCategory,
          sequence: formData.sequence,
          status: formData.status,
        };
  
        response = await axios.put(
          `http://localhost:3456/sub-category/${id}`,
          jsonData,
          { headers }
        );
      }
  
      // Handle success
      toast.success("Category updated successfully");
      setTimeout(() => {
        navigate("/category");
      }, 2000); // Navigate after 2 seconds
  
    } catch (error) {
      // Handle validation errors from Yup schema
      if (error instanceof Yup.ValidationError) {
        const errors = {};
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        console.log(errors)
        setValidationErrors(errors);
        setServerError("");
      } else {
        // Handle other errors (network/server errors)
        console.error("Error updating category:", error);
        setServerError("Failed to update category. Please try again later.");
        setValidationErrors({});
      }
    }
  };
  
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Card style={{ width: "400px" }}>
        <CardHeader className="text-center">Edit Category</CardHeader>
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
                SubCategory
              </Label>
              <Col sm={8}>
                <Input
                  type="select"
                  id="subCategory"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  disabled={!formData.categoryName}
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((subCategory) => (
                    <option key={subCategory._id} value={subCategory.subCategory}>
                      {subCategory.subCategory}
                    </option>
                  ))}
                </Input>
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
              <Label for="status" sm={4}>
                Status
              </Label>
              <Col sm={8}>
                <Input
                  type="select"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Input>
                {validationErrors.status && <p className="text-danger">{validationErrors.status}</p>}
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="currentImage" sm={4}>
                Current Image
              </Label>
              <Col sm={8}>
                {currentImageUrl && (
                  <img src={currentImageUrl} alt="Current Category" style={{ maxWidth: "100%", marginBottom: "10px" }} />
                )}
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
                  Update
                </Button>
              </Col>
            </FormGroup>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
