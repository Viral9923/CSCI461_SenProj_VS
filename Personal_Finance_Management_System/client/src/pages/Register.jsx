import React from "react";
import { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import Spinner from "../components/Spinner";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      await axios.post("/users/register", values);
      message.success("User Regisration Successful.");
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      message.error("User Registration Failed. Try Again.");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <div className="auth-container">
        <div className="image-column">
        <h1 className="main-title">Personal Finance Management System</h1>
          <img
            src="https://img.freepik.com/premium-photo/business-budget-plan-eyeglasses-laptop-blue-background_23-2148178559.jpg"
            alt="Register"
          />
        </div>
        <div className="form-column">
          {loading && <Spinner />}
          <Form layout="vertical" onFinish={submitHandler} className="register-form">
            <h1>Register Here</h1>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input type="email" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input type="password" />
            </Form.Item>
            <div className="d-flex justify-content-between">
              <Link to="/login" className="login-link">
                Already have an account?<br />
                Sign In Here
              </Link>
              <button className=" btn btn-primary">Register</button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Register;
