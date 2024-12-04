import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/users/login", values);
      message.success("Login Successful.");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, password: "" })
      );
      navigate("/");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Login Failed. Try Again");
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
            src="https://img.freepik.com/premium-photo/office-supplies-green-background-with-copy-space-insert-text_43284-1034.jpg?semt=ais_hybrid"
            alt="Login"
          />
        </div>
        <div className="form-column">
          {loading && <Spinner />}
          <Form layout="vertical" onFinish={submitHandler} className="login-form">
            <h1>Login Here</h1>
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
              <Link to="/register" className="register-link">
                New here! Create an account
              </Link>
              <button className=" btn btn-success">Login</button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
