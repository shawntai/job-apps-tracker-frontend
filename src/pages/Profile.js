import {
	Alert,
	Avatar,
	Button,
	Col,
	Descriptions,
	Row,
	Space,
	Spin,
	Typography,
} from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

const Profile = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const hiddenFileInput = useRef(null);

	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_BACKEND_URL}api/v1/profile`, {
				headers: {
					Authorization:
						"Bearer " + JSON.parse(localStorage.getItem("token")),
				},
			})
			.then((res) => {
				console.log({ res });
				setUser(res.data);
				setLoading(false);
			})
			.catch((err) => {
				console.log({ err });
				setError(err);
				setLoading(false);
			});
	}, []);

	if (loading) {
		return <Spin />;
	}

	if (error) {
		return <Alert message={error.message} type="error" />;
	}

	return (
		<Row gutter={[16, 16]} justify="space-between">
			<Col span={24}>
				<Typography.Title level={2}>My Profile</Typography.Title>
			</Col>
			<Col span={24}>
				<Space size="middle" align="center">
					<Avatar
						size={64}
						src={
							user &&
							user.avatar &&
							`${process.env.REACT_APP_BACKEND_URL}${user.avatar}`
						}
					>
						{user && !user.avatar && user.name.slice(0, 1)}
					</Avatar>
					<Button onClick={() => hiddenFileInput.current.click()}>
						Update Avatar
					</Button>
					<input
						type="file"
						ref={hiddenFileInput}
						style={{ display: "none" }}
						onChange={(event) => {
							const fileUploaded = event.target.files[0];
							const formData = new FormData();
							formData.append("avatar", fileUploaded);
							axios
								.post(
									`${process.env.REACT_APP_BACKEND_URL}api/v1/profile/uploadavatar`,
									formData,
									{
										headers: {
											Authorization:
												"Bearer " +
												JSON.parse(
													localStorage.getItem(
														"token"
													)
												),
										},
									}
								)
								.then((res) => {
									console.log("avatar uploaded", {
										res,
									});
									setUser(res.data);
								});
						}}
					/>
				</Space>
			</Col>
			<Col span={24}>
				<Descriptions title="User Info">
					<Descriptions.Item label="Name">
						{user && user.name}
					</Descriptions.Item>
					<Descriptions.Item label="Email">
						{user && user.email}
					</Descriptions.Item>
				</Descriptions>
			</Col>
		</Row>
	);
};

export default Profile;
