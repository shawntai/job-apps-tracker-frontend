import { Button, Form, Input, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// require("dotenv").config();

const Job = (props) => {
	const [job, setJob] = useState({});
	const jobId = useParams().id || props.jobId;
	const [form] = Form.useForm();
	const navigate = useNavigate();

	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_BACKEND_URL}api/v1/jobs/${jobId}`, {
				headers: {
					Authorization: `Bearer ${JSON.parse(
						localStorage.getItem("token")
					)}`,
				},
			})
			.then((res) => {
				console.log(res.data.job);
				setJob(res.data.job);
			});
	}, []);

	useEffect(() => {
		form.setFieldsValue(job);
	}, [job]);

	return (
		<>
			<Form
				form={form}
				labelAlign="right"
				labelCol={{
					span: 3,
				}}
				// wrapperCol={{
				// 	span: 16,
				// }}
				onFinish={(values) => {
					console.log(values);
					axios
						.patch(
							`${process.env.REACT_APP_BACKEND_URL}api/v1/jobs/${jobId}`,
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
							navigate("/jobs");
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
				{/* <Form.Item label="Status" name="status"><Input/></Form.Item> */}
				<Form.Item label="Status" name="status">
					<Select>
						<Select.Option value="interview">
							Interview
						</Select.Option>
						<Select.Option value="declined">Declined</Select.Option>
						<Select.Option value="pending">Pending</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item
					wrapperCol={{
						offset: 3,
						span: 16,
					}}
				>
					<Button type="primary" htmlType="submit">
						Save Changes
					</Button>
				</Form.Item>
			</Form>
			{/* <Button onClick={() => console.log(job)}>Check job</Button> */}
		</>
	);
};

export default Job;
