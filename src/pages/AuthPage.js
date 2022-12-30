import { Tabs, Typography } from "antd";
import Login from "./Login";
import Register from "./Register";

const AuthPage = () => {
	return (
		<Tabs
			centered={true}
			items={[
				{
					label: (
						<Typography.Title level={4}> Login </Typography.Title>
					),
					key: "1",
					children: <Login />,
				},
				{
					label: (
						<Typography.Title level={4}>Register </Typography.Title>
					),
					key: "2",
					children: <Register />,
				},
			]}
		/>
	);
};

export default AuthPage;
