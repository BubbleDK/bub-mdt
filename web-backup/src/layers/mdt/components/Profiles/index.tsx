import "./index.css";
import ProfileExtraInformation from "./components/ProfileExtraInformation";
import ProfileInformation from "./components/ProfileInformation";
import ProfileList from "./components/ProfileList";
import { useEffect } from "react";
import { removePages } from "../../../../helpers/removePages";

const Profiles = () => {
	useEffect(() => {
		return () => removePages(["profiles"]);
	}, []);

	return (
		<div className='profiles'>
			<ProfileList />
			<ProfileInformation />
			<ProfileExtraInformation />
		</div>
	);
};

export default Profiles;
