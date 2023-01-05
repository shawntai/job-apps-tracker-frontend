import { Alert, Button, Checkbox, Form, Input, Typography } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// require("dotenv").config();

const Login = () => {
	// const [token, setToken] = useLocalStorage("token", "");
	// const [user, setUser] = useLocalStorage("user", null);
	const [user, setUser] = useState(null);
	const [userRegistered, setUserRegistered] = useState(null);
	const navigate = useNavigate();

	const onFinish = (body) => {
		console.log("Success:", body);
		axios
			.post(`${process.env.REACT_APP_BACKEND_URL}api/v1/auth/login`, body)
			.then((res) => {
				console.log("user logged in", res);
				localStorage.setItem("token", JSON.stringify(res.data.token));
				// setToken(JSON.stringify(res.data.token));
				// setUser(JSON.stringify(res.data.user));
				localStorage.setItem("user", JSON.stringify(res.data.user));
				setUser(res.data.user);
				setUserRegistered("success");
				setTimeout(() => {
					navigate("/jobs");
				}, 1000);
			})
			.catch((err) => {
				console.log(err);
				setUserRegistered(err.response.data.msg);
			});
	};

	return (
		<>
			<Form
				onFinish={onFinish}
				labelCol={{
					span: 4,
				}}
			>
				<Form.Item
					label="Email"
					name="email"
					rules={[
						{
							required: true,
							message: "Please input your email!",
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Password"
					name="password"
					rules={[
						{
							required: true,
							message: "Please input your password!",
						},
					]}
				>
					<Input.Password />
				</Form.Item>
				<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Form.Item>
			</Form>
			{userRegistered && (
				<Alert
					message={
						userRegistered === "success"
							? `User logged in successfully. Hi, ${
									user && user.name
							  }!`
							: `Registration failed: ${userRegistered}`
					}
					type={userRegistered === "success" ? "success" : "error"}
					showIcon
				/>
			)}
		</>
	);
};

export default Login;
