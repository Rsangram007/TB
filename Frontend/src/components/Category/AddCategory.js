import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Button, FormGroup, Label, Input, Col, Card, CardBody, CardHeader } from "reactstrap";

const validationSchema = Yup.object().shape({
  categoryName: Yup.string().required("Category Name is required"),
  sequence: Yup.number().required("Sequence is required"),
  image: Yup.mixed().required("Image is required"),
});

const initialValues = {
  categoryName: "",
  sequence: "",
  image: null, // Initialize as null for file input
};

export default function AddCategory() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("categoryName", values.categoryName);
      formData.append("sequence", values.sequence);
      formData.append("image", values.image); // Append file to FormData

      const response = await axios.post("http://localhost:3456/category", formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data", // Set content type for FormData
        },
      });
console.log(response.data);
      //console.log(response.data);
      toast.success('Category Added Successfully');
      resetForm();
      setTimeout(() => {
        navigate('/category');
      }, 4000);

    } catch (err) {
      console.error("Error adding category:", err);

      if (err.response && err.response.data && Array.isArray(err.response.data.errors)) {
        const errorMessages = err.response.data.errors.map(error => error.msg).join(", ");
        setErrorMessage(errorMessages || "Failed to add category");

      } else if (err.response && err.response.data && typeof err.response.data.message === 'string') {
        setErrorMessage(err.response.data.message || "Failed to add category");

      } else {
        setErrorMessage("Network error occurred");
      }
    } 
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Card style={{ width: "400px" }}> 
        <CardHeader className="text-center">Add Category</CardHeader>
        <CardBody>
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form>

                <FormGroup row>
                  <Label for="categoryName" sm={4}>Category Name</Label>
                  <Col sm={8}>
                    <Field
                      type="text"
                      id="categoryName"
                      name="categoryName"
                      as={Input}
                      placeholder="Enter Category Name"
                    />
                    <ErrorMessage name="categoryName" component="div" className="text-danger" />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label for="sequence" sm={4}>Sequence</Label>
                  <Col sm={8}>
                    <Field
                      type="number"
                      id="sequence"
                      name="sequence"
                      as={Input}
                      placeholder="Enter Sequence"
                    />
                    <ErrorMessage name="sequence" component="div" className="text-danger" />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label for="image" sm={4}>Image</Label>
                  <Col sm={8}>
                    <Input
                      type="file"
                      id="image"
                      name="image"
                      onChange={(event) => {
                        setFieldValue("image", event.currentTarget.files[0]);
                      }}
                    />
                    <ErrorMessage name="image" component="div" className="text-danger" />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Col sm={{ size: 8, offset: 4 }}>
                    <Button type="submit" color="primary" disabled={isSubmitting}>
                      {isSubmitting ? "Adding..." : "Add Category"}
                    </Button>
                  </Col>
                </FormGroup>

              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </div>
  );
}
