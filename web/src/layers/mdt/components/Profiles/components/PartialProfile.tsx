import React from "react";
import { Text, Image } from "@mantine/core";
import { useProfilesStore } from "../../../../../stores";
import { DEBUG_PROFILE } from "../../../../../stores/profilesStore";
import { PartialProfileData, Profile } from "../../../../../typings";
import { fetchNui } from "../../../../../utils/fetchNui";
import locales from "../../../../../locales";
import dayjs from "dayjs";

interface Props {
	profile: PartialProfileData;
}

const PartialProfile: React.ForwardRefRenderFunction<
	HTMLDivElement | null,
	Props
> = ({ profile }, ref) => {
	const { setIsProfileWanted, setSelectedProfile } = useProfilesStore();

	const handleProfileClick = async (profile: PartialProfileData) => {
		setSelectedProfile(null);
		setIsProfileWanted(false);
		const resp = await fetchNui<Profile>("getProfile", profile.citizenid, {
			data: {
				...DEBUG_PROFILE,
				firstName: profile.firstname,
				lastName: profile.lastname,
				citizenid: profile.citizenid,
			},
		});

		const isProfileWanted = await fetchNui<boolean>(
			"isProfileWanted",
			profile.citizenid,
			{
				data: false,
			}
		);

		setSelectedProfile(resp);
		setIsProfileWanted(isProfileWanted);
	};

	return (
		<div
			className='profile-card'
			onClick={() => handleProfileClick(profile)}
			ref={ref}
		>
			<Image
				width={65}
				height={65}
				src={
					profile.image ??
					"https://cdn.vectorstock.com/i/preview-1x/97/68/account-avatar-dark-mode-glyph-ui-icon-vector-44429768.jpg"
				}
				radius={"lg"}
				alt='With default placeholder'
				withPlaceholder
			/>

			<div>
				<Text weight={600} style={{ fontSize: 13, color: "white" }}>
					{profile.firstname} {profile.lastname}
				</Text>

				<Text style={{ fontSize: 12, color: "white" }}>
					{locales.dob}: {dayjs(profile.dob).format("DD/MM/YYYY")}
				</Text>

				<Text style={{ fontSize: 12, color: "white" }}>
					{locales.citizen_id}: {profile.citizenid}
				</Text>
			</div>
		</div>
	);
};

export default React.memo(React.forwardRef(PartialProfile));
