import {
	Button,
	Col,
	Divider,
	Drawer,
	Form,
	Input,
	Modal,
	Row,
	Select,
	Space,
	Table,
	Typography,
} from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import {
	DeleteOutlined,
	EditOutlined,
	LogoutOutlined,
	UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Job from "./Job";

// require('dotenv').config();

const Jobs = () => {
	const [jobs, setJobs] = useState([]);
	const [user, setUser] = useState(null);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const showDrawer = () => {
		setDrawerOpen(true);
	};
	const onClose = () => {
		setDrawerOpen(false);
	};
	const navigate = useNavigate();
	const logout = () => {
		localStorage.clear();
		navigate("/auth");
	};

	const [job, setJob] = useState({});
	const [modalOpen, setModalOpen] = useState(false);
	const showModal = () => {
		setModalOpen(true);
	};
	const handleOk = () => {
		form.submit();
		setModalOpen(false);
		console.log("handleOk");
	};
	const handleCancel = () => {
		setModalOpen(false);
	};

	const [form] = Form.useForm();
	useEffect(() => {
		form.setFieldsValue(job);
	}, [job]);

	const fetchJobs = () => {
		axios
			.get(`${process.env.REACT_APP_BACKEND_URL}api/v1/jobs`, {
				headers: {
					Authorization: `Bearer ${JSON.parse(
						localStorage.getItem("token")
					)}`,
				},
			})
			.then((res) => {
				console.log(res);
				setJobs(res.data.jobs);
			});
	};

	useEffect(() => {
		// let aUser = JSON.parse(localStorage.getItem("user"));
		// // TO-DO: need to parse twice for some reason...
		// // let aUser = JSON.parse(JSON.parse(localStorage.getItem("user")));
		// console.log(aUser);
		// console.log("aUser's type: ", typeof aUser);
		// setUser(aUser);
		setUser(JSON.parse(localStorage.getItem("user")));
		fetchJobs();
	}, []);

	const columns = [
		{
			title: "Company",
			dataIndex: "company",
			key: "company",
			render: (text, record) => (
				<a onClick={() => navigate(`/jobs/${record._id}`)}>{text}</a>
			),
		},
		{
			title: "Position",
			dataIndex: "position",
			key: "position",
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
		},
		{
			title: "Actions",
			dataIndex: "actions",
			key: "actions",
			render: (text, record) => (
				<Space>
					<Button
						onClick={() => {
							showModal();
							setJob(record);
						}}
					>
						<EditOutlined />
					</Button>
					<Button
						onClick={() => {
							axios
								.delete(
									`${process.env.REACT_APP_BACKEND_URL}api/v1/jobs/${record._id}`,
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
									console.log("deleted:", res);
									fetchJobs();
								});
						}}
					>
						<DeleteOutlined style={{ color: "red" }} />
					</Button>
				</Space>
			),
		},
	];

	return (
		<>
			<Header>
				<Row type="flex" style={{ alignItems: "center" }}>
					<Col span={20}>
						<Typography.Title level={3}>
							My Job Applications
						</Typography.Title>
					</Col>
					<Col
						span={4}
						type="flex"
						align="middle"
						onClick={showDrawer}
						style={{ cursor: "pointer" }}
					>
						<UserOutlined
							style={{ fontSize: "200%", width: "100%" }}
						/>
						<Typography style={{ width: "100%" }}>
							Hi, {user && user.name}
						</Typography>
					</Col>
				</Row>
			</Header>
			<Content>
				<Row justify="end">
					{/* <Col span={18} style={{ backgroundColor: "" }}></Col>
					<Col span={6} style={{ backgroundColor: "", padding: "10px 0px 10px 0px"}}> */}
					<Button type="primary" style={{ margin: "15px" }}>
						<a
							onClick={() => navigate("/create")}
							style={{ color: "white" }}
						>
							Add Application
						</a>
					</Button>
					{/* </Col> */}
				</Row>
				<Table
					columns={columns}
					dataSource={jobs.map((job) => {
						return { ...job, key: job._id };
					})}
				/>
			</Content>
			<Footer></Footer>
			<Drawer title="Account" onClose={onClose} open={drawerOpen}>
				<Space direction="vertical" size="large">
					<Typography.Title level={4}>
						{user && user.name}
					</Typography.Title>
					<Typography.Text level={4}>
						{user && user.email}
					</Typography.Text>
					<Divider />
					<Button onClick={logout}>
						<LogoutOutlined />
						Log Out
					</Button>
				</Space>
			</Drawer>
			<Modal
				open={modalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				closable={false}
				// footer={null}
			>
				{/* <Job jobId={"63843664d390a946abc6a479"}></Job> */}
				<Form
					form={form}
					labelAlign="right"
					labelCol={{
						span: 4,
					}}
					onFinish={(values) => {
						console.log({ values });
						axios
							.patch(
								`${process.env.REACT_APP_BACKEND_URL}api/v1/jobs/${values._id}`,
								values,
								{
									headers: {
										Authorization:
											"Bearer " +
											JSON.parse(
												localStorage.getItem("token")
											),
									},
								}
							)
							.then((res) => {
								console.log({ updatedJob: res });
								fetchJobs();
							});
					}}
				>
					<Form.Item label="Job ID" name="_id">
						<Input disabled />
					</Form.Item>
					<Form.Item
						label="Company"
						name="company"
						rules={[
							{
								required: true,
								message: "Please input the company!",
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="Position"
						name="position"
						rules={[
							{
								required: true,
								message: "Please input the position!",
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item label="Status" name="status">
						<Select>
							<Select.Option value="interview">
								Interview
							</Select.Option>
							<Select.Option value="declined">
								Declined
							</Select.Option>
							<Select.Option value="pending">
								Pending
							</Select.Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default Jobs;
