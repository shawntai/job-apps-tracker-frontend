import { Alert, Button, Checkbox, Form, Input, Typography } from "antd";
import axios from "axios";
import { useState } from "react";
import useLocalStorage from "use-local-storage";

// require('dotenv').config();

const Register = () => {
	const [token, setToken] = useLocalStorage("token", "");
	const [userRegistered, setUserRegistered] = useState(null);

	const onFinish = (body) => {
		// console.log("Success:", body);
		axios
			.post(
				`${process.env.REACT_APP_BACKEND_URL}api/v1/auth/register`,
				body
			)
			.then((res) => {
				console.log("user registered", res);
				setToken(res.data.token);
				setUserRegistered("success");
			})
			.catch((err) => {
				console.log(err);
				setUserRegistered(err.response.data.msg);
			});
	};

	return (
		<>
			{/* <Typography.Title level={2}> Log In </Typography.Title> */}
			<Form
				onFinish={onFinish}
				labelCol={{
					span: 4,
				}}
			>
				<Form.Item
					label="Name"
					name="name"
					rules={[
						{
							required: true,
							message: "Please input your name!",
						},
					]}
				>
					<Input />
				</Form.Item>
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
						Register
					</Button>
				</Form.Item>
			</Form>
			{userRegistered && (
				<Alert
					message={
						userRegistered === "success"
							? "User registered"
							: `Registration failed: ${userRegistered}`
					}
					type={userRegistered === "success" ? "success" : "error"}
					showIcon
				/>
			)}
		</>
	);
};

export default Register;
