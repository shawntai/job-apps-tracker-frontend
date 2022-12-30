import { Button, Form, Input, Select } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// require("dotenv").config();

const Create = () => {
	const navigate = useNavigate();

	return (
		<>
			<Form
				// form={form}
				labelAlign="right"
				labelCol={{
					span: 3,
				}}
				onFinish={(values) => {
					console.log(values);
					axios
						.post(
							`${process.env.REACT_APP_BACKEND_URL}api/v1/jobs/`,
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
							console.log({ newJobCreated: res });
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
		</>
	);
};

export default Create;
