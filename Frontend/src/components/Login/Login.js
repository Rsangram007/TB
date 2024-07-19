// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { GiAndroidMask } from "react-icons/gi";
// import * as yup from "yup";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useAuth } from "../../context/AuthContext";
// import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
// import { useDispatch } from "react-redux";
// import { startForgotPassword } from "../../actions/forgot-action";
// import "./Login.css";

// export default function Login() {
//   const { handleLogin } = useAuth();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const initialFormState = {
//     email: "",
//     password: "",
//   };
//   const [form, setForm] = useState(initialFormState);
//   const [serverErrors, setServerErrors] = useState(null);
//   const [clientErrors, setClientErrors] = useState(null);
//   const [modal, setModal] = useState(false);
//   const [forgotEmail, setForgotEmail] = useState("");
//   const [forgotEmailError, setForgotEmailError] = useState("");
//   const [forgotServerError, setForgotServerError] = useState(null);

//   const validationSchema = yup.object({
//     email: yup.string().email("Invalid email").required("Email is required"),
//     password: yup
//       .string()
//       .required("Password is required")
//       .min(8, "Password should contain at least 8 characters")
//       .matches(/[a-z]/, "Password must contain at least one lowercase letter")
//       .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
//       .matches(/[0-9]/, "Password must contain at least one number")
//       .matches(
//         /[!@#$%^&*(),.?":{}|<>]/,
//         "Password must contain at least one special character"
//       ),
//   });

//   const validationSchemaForgot = yup.object({
//     forgotEmail: yup
//       .string()
//       .email("Invalid email")
//       .required("Email is required"),
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//     if (serverErrors) {
//       setServerErrors(null);
//     }
//     if (clientErrors) {
//       setClientErrors(null);
//     }
//   };

//   const toggle = () => {
//     setModal(!modal);
//     setForgotEmail("");
//     setForgotEmailError("");
//     setForgotServerError(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setClientErrors(null);
//     setServerErrors(null);

//     try {
//       await validationSchema.validate(form, { abortEarly: false });

//       const formData = {
//         email: form.email,
//         password: form.password,
//       };

//       const response = await axios.post(
//         "http://localhost:3456/login",
//         formData
//       );
//       localStorage.setItem("token", response.data.token);
//       const userResponse = await axios.get("http://localhost:3456/account", {
//         headers: {
//           Authorization: localStorage.getItem("token"),
//         },
//       });
//       handleLogin(userResponse.data);
//       setForm(initialFormState);
//       toast.success("Login Success", {
//         autoClose: 1000,
//         onClose: () => {
//           navigate("/dashboard");
//         },
//       });
//     } catch (err) {
//       if (err.inner) {
//         const newErrors = {};
//         err.inner.forEach((error) => {
//           newErrors[error.path] = error.message;
//         });
//         setClientErrors(newErrors);
//       } else {
//         setServerErrors(err?.response?.data[0]);
//       }
//     }
//   };

//   const handleSubmitForgotPassword = async (e) => {
//     e.preventDefault();
//     try {
//       await validationSchemaForgot.validate({ forgotEmail });
//       setForgotEmailError("");
//       dispatch(startForgotPassword(forgotEmail, toggle, navigate));
//     } catch (error) {
//       if (error instanceof yup.ValidationError) {
//         setForgotEmailError(error.message);
//       } else if (error.response && error.response.status === 404) {
//         setForgotEmailError(error.response.data.message);
//       } else {
//         setForgotServerError(error.message || "An error occurred");
//       }
//     }
//   };

//   const displayErrors = (errors, field) => {
//     return (
//       errors &&
//       errors[field] && (
//         <span style={{ color: "red" }}>
//           <li>{errors[field]}</li>
//         </span>
//       )
//     );
//   };

//   return (
//     <div className="login-box">
//       <h2>
//         <GiAndroidMask /> Table Sprint
//       </h2>
//       <form onSubmit={handleSubmit}>
//         <div className="user-box">
//           <input
//             type="text"
//             id="email"
//             value={form.email}
//             name="email"
//             onChange={handleChange}
//             required
//           />
//           <label>Email</label>
//           {displayErrors(clientErrors, "email")}
//           {!clientErrors && displayErrors(serverErrors, "email")}
//         </div>

//         <div className="user-box">
//           <input
//             type="password"
//             id="password"
//             value={form.password}
//             name="password"
//             onChange={handleChange}
//             required
//           />
//           <label>Password</label>
//           {displayErrors(clientErrors, "password")}
//           {!clientErrors && displayErrors(serverErrors, "password")}
//         </div>

//         {serverErrors && !clientErrors && (
//           <div className="error-messages">
//             {Object.values(serverErrors).map((error, index) => (
//               <li key={index}>{error}</li>
//             ))}
//           </div>
//         )}

//         <button className="btn-primary" type="submit">
//           Login
//         </button>
//         <Link to="#" onClick={toggle}>
//           Forgot password?
//         </Link>
//       </form>

//       <Modal isOpen={modal} toggle={toggle}>
//         <ModalHeader toggle={toggle}>Forgot Password</ModalHeader>
//         <ModalBody>
//           <form onSubmit={handleSubmitForgotPassword}>
//             <input
//               className="form-control"
//               type="text"
//               placeholder="Enter Email to reset Password"
//               value={forgotEmail}
//               onChange={(e) => setForgotEmail(e.target.value)}
//             />
//             {forgotEmailError && (
//               <p className="text-danger mt-2 mb-0">{forgotEmailError}</p>
//             )}
//             {forgotServerError && (
//               <p className="text-danger mt-2 mb-0">{forgotServerError}</p>
//             )}
//           </form>
//         </ModalBody>
//         <ModalFooter>
//           <Button color="primary" onClick={handleSubmitForgotPassword}>
//             Submit
//           </Button>
//           <Button color="secondary" onClick={toggle}>
//             Cancel
//           </Button>
//         </ModalFooter>
//       </Modal>

//       <p className="register-link">
//         Don't have an account?{" "}
//         <Link to="/register" className="fw-bold">
//           Register
//         </Link>
//       </p>
//     </div>
//   );
// }



import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { GiAndroidMask } from "react-icons/gi";
import * as yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { useDispatch } from "react-redux";
import { startForgotPassword } from "../../actions/forgot-action";
import "./Login.css";

export default function Login() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialFormState = {
    email: "",
    password: "",
  };
  const [form, setForm] = useState(initialFormState);
  const [serverErrors, setServerErrors] = useState(null);
  const [clientErrors, setClientErrors] = useState(null);
  const [modal, setModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotEmailError, setForgotEmailError] = useState("");
  const [forgotServerError, setForgotServerError] = useState(null);

  const validationSchema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password should contain at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
  });

  const validationSchemaForgot = yup.object({
    forgotEmail: yup
      .string()
      .email("Invalid email")
      .required("Email is required"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (serverErrors) {
      setServerErrors(null);
    }
    if (clientErrors) {
      setClientErrors(null);
    }
  };

  const toggle = () => {
    setModal(!modal);
    setForgotEmail("");
    setForgotEmailError("");
    setForgotServerError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClientErrors(null);
    setServerErrors(null);

    try {
      await validationSchema.validate(form, { abortEarly: false });

      const formData = {
        email: form.email,
        password: form.password,
      };

      const response = await axios.post(
        "http://localhost:3456/login",
        formData
      );
      localStorage.setItem("token", response.data.token);
      const userResponse = await axios.get("http://localhost:3456/account", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      handleLogin(userResponse.data);
      setForm(initialFormState);
      toast.success("Login Success", {
        autoClose: 1000,
        onClose: () => {
          navigate("/dashboard");
        },
      });
    } catch (err) {
      if (err.inner) {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setClientErrors(newErrors);
      } else {
        setServerErrors(err?.response?.data[0]);
      }
    }
  };

  const handleSubmitForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await validationSchemaForgot.validate({ forgotEmail });
      setForgotEmailError("");
      dispatch(startForgotPassword(forgotEmail, toggle, navigate));
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setForgotEmailError(error.message);
      } else if (error.response && error.response.status === 404) {
        setForgotEmailError(error.response.data.message);
      } else {
        setForgotServerError(error.message || "An error occurred");
      }
    }
  };

  const displayErrors = (errors, field) => {
    return (
      errors &&
      errors[field] && (
        <span style={{ color: "red" }}>
          <li>{errors[field]}</li>
        </span>
      )
    );
  };

  return (
    <div className="login-box">
      <h2>
        <GiAndroidMask /> Table Sprint
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="user-box">
          <input
            type="text"
            id="email"
            value={form.email}
            name="email"
            onChange={handleChange}
            required
          />
          <label>Email</label>
          {displayErrors(clientErrors, "email")}
          {!clientErrors && displayErrors(serverErrors, "email")}
        </div>

        <div className="user-box">
          <input
            type="password"
            id="password"
            value={form.password}
            name="password"
            onChange={handleChange}
            required
          />
          <label>Password</label>
          {displayErrors(clientErrors, "password")}
          {!clientErrors && displayErrors(serverErrors, "password")}
        </div>

        {serverErrors && !clientErrors && (
          <div className="error-messages">
            {Object.values(serverErrors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </div>
        )}

        <button className="btn-primary" type="submit">
          Login
        </button>
        <Link to="#" onClick={toggle}>
          Forgot password?
        </Link>
      </form>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Forgot Password</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmitForgotPassword}>
            <input
              className="form-control"
              type="text"
              placeholder="Enter Email to reset Password"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
            {forgotEmailError && (
              <p className="text-danger mt-2 mb-0">{forgotEmailError}</p>
            )}
            {forgotServerError && (
              <p className="text-danger mt-2 mb-0">{forgotServerError}</p>
            )}
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmitForgotPassword}>
            Submit
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <p className="register-link">
        Don't have an account?{" "}
        <Link to="/register" className="fw-bold">
          Register
        </Link>
      </p>
    </div>
  );
}
