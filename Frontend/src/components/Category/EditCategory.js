// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { Button, FormGroup, Label, Input, Col, Card, CardBody, CardHeader } from "reactstrap";
// import { useNavigate, useParams } from "react-router-dom";
// import * as Yup from "yup";

// export default function EditCategory() {
//   const navigate = useNavigate();
//   const { id } = useParams(); // Extracting id from URL params

//   const [categories, setCategories] = useState([]);
//   const [formData, setFormData] = useState({
//     categoryName: "",
//     sequence: "",
//     image: null,
//     status: "", // Default status value
//   });

//   const [currentImage, setCurrentImage] = useState(null); // State to store current image
//   const [currentImageUrl, setCurrentImageUrl] = useState(""); // State to store current image URL
//   const [validationErrors, setValidationErrors] = useState({});
//   const [serverError, setServerError] = useState("");

//   useEffect(() => {
//     fetchCategories();
//     fetchCategoryDetails();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get("http://localhost:3456/category", {
//         headers: {
//           Authorization: localStorage.getItem("token"),
//         },
//       });
//       setCategories(response.data);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const fetchCategoryDetails = async () => {
//     try {
//       const response = await axios.get(`http://localhost:3456/category/${id}`, {
//         headers: {
//           Authorization: localStorage.getItem("token"),
//         },
//       });
//       const { categoryName, sequence, status, image } = response.data;
//       setFormData({
//         categoryName,
//         sequence,
//         status,
//         image: image,
//       });
//       setCurrentImage(image); // Set current image in state
//       if (image) {
//         // Assuming the API returns a direct URL to the image
//         setCurrentImageUrl(`http://localhost:3456/${image}`);
//       }
//     } catch (error) {
//       console.error("Error fetching category details:", error);
//     }
//   };

//   const validationSchema = Yup.object().shape({
//     categoryName: Yup.string().required("Category Name is required"),
//     sequence: Yup.number()
//       .integer("Sequence must be an integer")
//       .typeError("Sequence must be a number")
//       .required("Sequence is required"),
//     status: Yup.string().required("Status is required"),
//   });

//   const handleChange = (e) => {
//     if (e.target.name === "image") {
//       if (e.target.files.length > 0) {
//         setFormData({ ...formData, image: e.target.files[0] });
//       } else {
//         setFormData({ ...formData, image: null }); // Ensure image is null if no file selected
//       }
//     } else {
//       const { name, value } = e.target;
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await validationSchema.validate(formData, { abortEarly: false });
//       let response;
//       if (formData.image !== null && formData.image !== undefined) {
//         // If image is selected, send multipart form data
//         const formDataToSend = new FormData();
//         formDataToSend.append("categoryName", formData.categoryName);
//         formDataToSend.append("sequence", formData.sequence);
//         formDataToSend.append("status", formData.status);
//         formDataToSend.append("image", formData.image);
//         response = await axios.put(
//           `http://localhost:3456/category/${id}`,
//           formDataToSend,
//           {
//             headers: {
//               Authorization: localStorage.getItem("token"),
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );
//       } else {
//         // If no image is selected, send regular JSON data
//         const jsonData = {
//           categoryName: formData.categoryName,
//           sequence: formData.sequence,
//           status: formData.status,
//         };
//         response = await axios.put(
//           `http://localhost:3456/category/${id}`,jsonData,
//           {
//             headers: {
//               Authorization: localStorage.getItem("token"),
//             },
//           }
//         );
//       }
//       toast.success("Category updated successfully");
//       setTimeout(() => {
//         navigate("/category");
//       }, 4000);
//     } catch (error) {
//       if (error instanceof Yup.ValidationError) {
//         // Yup validation error
//         const errors = {};
//         error.inner.forEach((err) => {
//           errors[err.path] = err.message;
//         });
//         setValidationErrors(errors);
//         setServerError("");
//       } else {
//         // Other errors (e.g., network errors, server errors)
//         console.error("Error updating category:", error);
//         setServerError(
//           "Failed to update category. Please try again later."
//         );
//         setValidationErrors({});
//       }
//     }
//   };
  
//   return (
//     <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
//       <Card style={{ width: "400px" }}>
//         <CardHeader className="text-center">Edit Category</CardHeader>
//         <CardBody>
//           {serverError && <p className="text-danger">{serverError}</p>}
//           <form onSubmit={handleSubmit}>
//             <FormGroup row>
//               <Label for="categoryName" sm={4}>
//                 Category
//               </Label>
//               <Col sm={8}>
//                 <Input
//                   type="select"
//                   id="categoryName"
//                   name="categoryName"
//                   value={formData.categoryName}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map((category) => (
//                     <option key={category._id} value={category.categoryName}>
//                       {category.categoryName}
//                     </option>
//                   ))}
//                 </Input>
//                 {validationErrors.categoryName && <p className="text-danger">{validationErrors.categoryName}</p>}
//               </Col>
//             </FormGroup>

//             <FormGroup row>
//               <Label for="sequence" sm={4}>
//                 Sequence
//               </Label>
//               <Col sm={8}>
//                 <Input
//                   type="number"
//                   id="sequence"
//                   name="sequence"
//                   value={formData.sequence}
//                   onChange={handleChange}
//                   placeholder="Enter Sequence"
//                 />
//                 {validationErrors.sequence && <p className="text-danger">{validationErrors.sequence}</p>}
//               </Col>
//             </FormGroup>

//             <FormGroup row>
//               <Label for="status" sm={4}>
//                 Status
//               </Label>
//               <Col sm={8}>
//                 <Input
//                   type="select"
//                   id="status"
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </Input>
//                 {validationErrors.status && <p className="text-danger">{validationErrors.status}</p>}
//               </Col>
//             </FormGroup>

//             <FormGroup row>
//               <Label for="currentImage" sm={4}>
//                 Current Image
//               </Label>
//               <Col sm={8}>
//                 {currentImageUrl && (
//                   <img src={currentImageUrl} alt="Current Category" style={{ maxWidth: "50%", marginBottom: "10px" }} />
//                 )}
//                 <Input
//                   type="file"
//                   id="image"
//                   name="image"
//                   onChange={handleChange}
//                 />
//                 {validationErrors.image && <p className="text-danger">{validationErrors.image}</p>}
//               </Col>
//             </FormGroup>

//             <FormGroup row>
//               <Col sm={{ size: 8, offset: 4 }}>
//                 <Button type="submit" color="primary">
//                   Update Category
//                 </Button>
//               </Col>
//             </FormGroup>
//           </form>
//         </CardBody>
//       </Card>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, FormGroup, Label, Input, Col, Card, CardBody, CardHeader } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import './EditCategory.css'; // Import the CSS file

export default function EditCategory() {
  const navigate = useNavigate();
  const { id } = useParams(); // Extracting id from URL params

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryName: "",
    sequence: "",
    image: null,
    status: "", // Default status value
  });

  const [currentImage, setCurrentImage] = useState(null); // State to store current image
  const [currentImageUrl, setCurrentImageUrl] = useState(""); // State to store current image URL
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

  const fetchCategoryDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3456/category/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const { categoryName, sequence, status, image } = response.data;
      setFormData({
        categoryName,
        sequence,
        status,
        image: image,
      });
      setCurrentImage(image); // Set current image in state
      if (image) {
        // Assuming the API returns a direct URL to the image
        setCurrentImageUrl(`http://localhost:3456/${image}`);
      }
    } catch (error) {
      console.error("Error fetching category details:", error);
    }
  };

  const validationSchema = Yup.object().shape({
    categoryName: Yup.string().required("Category Name is required"),
    sequence: Yup.number()
      .integer("Sequence must be an integer")
      .typeError("Sequence must be a number")
      .required("Sequence is required"),
    status: Yup.string().required("Status is required"),
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      if (e.target.files.length > 0) {
        setFormData({ ...formData, image: e.target.files[0] });
      } else {
        setFormData({ ...formData, image: null }); // Ensure image is null if no file selected
      }
    } else {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      let response;
      if (formData.image !== null && formData.image !== undefined) {
        // If image is selected, send multipart form data
        const formDataToSend = new FormData();
        formDataToSend.append("categoryName", formData.categoryName);
        formDataToSend.append("sequence", formData.sequence);
        formDataToSend.append("status", formData.status);
        formDataToSend.append("image", formData.image);
        response = await axios.put(
          `http://localhost:3456/category/${id}`,
          formDataToSend,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // If no image is selected, send regular JSON data
        const jsonData = {
          categoryName: formData.categoryName,
          sequence: formData.sequence,
          status: formData.status,
        };
        response = await axios.put(
          `http://localhost:3456/category/${id}`,jsonData,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
      }
      toast.success("Category updated successfully");
      setTimeout(() => {
        navigate("/category");
      }, 4000);
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
        console.error("Error updating category:", error);
        setServerError(
          "Failed to update category. Please try again later."
        );
        setValidationErrors({});
      }
    }
  };
  
  return (
    <div className="edit-category-container d-flex justify-content-center align-items-center">
      <Card className="edit-category-card">
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
                  <img src={currentImageUrl} alt="Current Category" className="current-image" />
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
                  Update Category
                </Button>
              </Col>
            </FormGroup>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
