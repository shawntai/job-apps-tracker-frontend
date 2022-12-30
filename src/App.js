import { useEffect, useState } from "react";
import axios from "axios";

// require("dotenv").config();

const App = () => {
	const [firstMsg, setFirstMsg] = useState("");
	useEffect(() => {
		console.log(process.env.REACT_APP_BACKEND_URL);
		axios.get(process.env.REACT_APP_BACKEND_URL).then((res) => {
			console.log(res);
			setFirstMsg(res.data);
		});
	}, []);
	return <h1>This is my frontend, {firstMsg} </h1>;
};

export default App;
