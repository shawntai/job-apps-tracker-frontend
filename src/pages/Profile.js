import {
	Alert,
	Avatar,
	Button,
	Col,
	Descriptions,
	Modal,
	Row,
	Space,
	Spin,
	Typography,
} from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";

import "react-image-crop/dist/ReactCrop.css";
import { useDebounceEffect } from "../hooks/useDebounceEffect";
import { canvasPreview } from "../utils/canvasPreview";

// import "./Profile.css";

const Profile = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const hiddenFileInput = useRef(null);
	const [crop, setCrop] = useState(null);
	const [completedCrop, setCompletedCrop] = useState(null);
	const [imgSrc, setImgSrc] = useState(null);
	const imgRef = useRef(null);
	// const [image, setImage] = useState(null);
	const [croppedImageUrl, setCroppedImageUrl] = useState(null);
	const [blob, setBlob] = useState(null);
	const previewCanvasRef = useRef(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const showModal = () => {
		setIsModalOpen(true);
		console.log("show modal");
	};
	const handleOk = () => {
		setIsModalOpen(false);
		// console.log("crop", crop);

		// const fileUploaded = e.target.files[0];
		const formData = new FormData();
		formData.append("avatar", blob);
		axios
			.post(
				`${process.env.REACT_APP_BACKEND_URL}api/v1/profile/uploadavatar`,
				formData,
				{
					headers: {
						Authorization:
							"Bearer " +
							JSON.parse(localStorage.getItem("token")),
					},
				}
			)
			.then((res) => {
				console.log("avatar uploaded", {
					res,
				});
				setUser(res.data);
			});
	};
	const handleCancel = () => {
		setIsModalOpen(false);
	};

	useEffect(() => {
		console.log("crop", crop);
	}, [crop]);

	const centerAspectCrop = (mediaWidth, mediaHeight, aspect) => {
		return centerCrop(
			makeAspectCrop(
				{
					unit: "%",
					width: 100,
				},
				aspect,
				mediaWidth,
				mediaHeight
			),
			mediaWidth,
			mediaHeight
		);
	};

	const onSelectFile = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			setCrop(undefined);
			setImgSrc(undefined); // reset imgSrc to undefined so it forces onLoad (which sets the crop) to run again even when the same file is selected
			console.log("inside onSelectFile");
			const reader = new FileReader();
			reader.addEventListener("load", () => {
				setImgSrc(reader.result.toString() || "");
			});
			reader.readAsDataURL(e.target.files[0]);
		}
	};

	const makeClientCrop = async (crop) => {
		if (this.imageRef && crop.width && crop.height) {
			const croppedImageUrl = await this.getCroppedImg(
				this.imageRef,
				crop,
				"newFile.jpeg"
			);
			setCroppedImageUrl(croppedImageUrl);
		}
	};

	const getCroppedImg = (image, crop, fileName) => {
		const canvas = document.createElement("canvas");
		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;
		canvas.width = crop.width;
		canvas.height = crop.height;
		const ctx = canvas.getContext("2d");

		ctx.drawImage(
			image,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			crop.width,
			crop.height
		);

		return new Promise((resolve, reject) => {
			canvas.toBlob((blob) => {
				if (!blob) {
					//reject(new Error('Canvas is empty'));
					console.error("Canvas is empty");
					return;
				}
				setBlob(blob);
				blob.name = fileName;
				window.URL.revokeObjectURL(this.fileUrl);
				this.fileUrl = window.URL.createObjectURL(blob);
				resolve(this.fileUrl);
			}, "image/jpeg");
		});
	};

	// useEffect(() => {
	// 	async
	// }, [crop]);

	// const cropCompleted = async () => {
	// 	if (crop?.width && crop?.height && imgRef.current && previewCanvasRef.current) {
	// 		// console.log({image: imgRef.current})
	// 		const blob = await canvasPreview(imgRef.current, previewCanvasRef.current, crop);
	// 		setBlob(blob);
	// 		console.log({ blob });
	// 	}
	// };

	const onImgLoad = async (e) => {
		// setImage(e);
		const { width, height } = e.currentTarget;
		console.log({ width, height });
		setCrop(centerAspectCrop(width, height, 1));
		// setCrop({
		// 	x: Math.max(0.0, (width - height) / 2.0),
		// 	y: Math.max(0.0, (height - width) / 2.0),
		// 	width: Math.min(width, height),
		// 	height: Math.min(width, height),
		// 	unit: "px",
		// });
		// await cropCompleted();
	};

	useDebounceEffect(
		async () => {
			if (
				completedCrop?.width &&
				completedCrop?.height &&
				imgRef.current &&
				previewCanvasRef.current
			) {
				// console.log({image: imgRef.current})
				const blob = await canvasPreview(
					imgRef.current,
					previewCanvasRef.current,
					completedCrop
				);
				setBlob(blob);
				console.log({ blob });
			}
		},
		100,
		[completedCrop]
	);

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
		<>
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
							// TODO: onChange only triggers when the file changes, meaning if you (accidently) close the modal, open it again, and select the same file, it won't trigger, which means the showModel() inside won't get called either. Potential fix: use onLoad instead
							onClick={(e) => (e.target.value = "")}
							onChange={(e) => {
								// setCrop(undefined);
								onSelectFile(e);
								showModal();
								//
								//
								////////////////////////////////////////
								// const fileUploaded = e.target.files[0];
								// console.log({ fileUploaded });
								// const formData = new FormData();
								// formData.append("avatar", fileUploaded);
								/*axios
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
									});*/
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
			<Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
				{imgSrc && (
					<>
						<ReactCrop
							crop={crop}
							onChange={(_, percentCrop) => setCrop(percentCrop)}
							onComplete={setCompletedCrop}
							aspect={1}
						>
							<img ref={imgRef} src={imgSrc} onLoad={onImgLoad} />
						</ReactCrop>
						{!!completedCrop && (
							<canvas
								ref={previewCanvasRef}
								style={{
									display: 'none',
									border: "1px solid black",
									objectFit: "contain",
									width: completedCrop.width,
									height: completedCrop.height,
								}}
							/>
						)}
					</>
				)}
			</Modal>
		</>
	);
};

export default Profile;
