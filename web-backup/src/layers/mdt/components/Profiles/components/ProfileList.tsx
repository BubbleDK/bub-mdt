import { rem, Input, Divider, Text, ScrollArea, Loader } from "@mantine/core";
import { IconUsers, IconSearch } from "@tabler/icons-react";
import "../index.css";
import { useState, useMemo } from "react";
import locales from "../../../../../locales";
import { useInfiniteScroll } from "../../../../../hooks/useInfiniteScroll";
import PartialProfile from "./PartialProfile";
import { useProfilesQuery } from "../../../../../stores/profilesStore";

const ProfileList = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const { data, fetchNextPage, isFetching, isDebouncing } =
		useProfilesQuery(searchQuery);
	const { ref } = useInfiniteScroll(() => fetchNextPage());

	const pages = useMemo(() => {
		if (!data) return [];
		return data.pages.flatMap((page) => page.profiles);
	}, [data]);

	return (
		<div className='content-width'>
			<div className='card-background'>
				<div className='card-title'>
					<Text style={{ fontSize: 17, color: "white" }} weight={500}>
						{locales.profiles}
					</Text>

					<IconUsers size={rem(25)} color='white' />
				</div>

				<Input
					icon={<IconSearch />}
					variant='filled'
					placeholder={locales.search}
					mt={10}
					mb={10}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>

				<Divider mt={5} mb={5} />

				<div className='profiles-card-content'>
					<ScrollArea h={860}>
						<div className='profiles-card-content-flex'>
							{isDebouncing || isFetching ? (
								<div
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<Loader />
								</div>
							) : pages.length > 0 ? (
								pages.map((profile, i) => (
									<PartialProfile
										key={profile.citizenid}
										profile={profile}
										ref={i === pages.length - 2 ? ref : null}
									/>
								))
							) : (
								<Text color='dimmed' size='xs'>
									{locales.no_profiles_found}
								</Text>
							)}
						</div>
					</ScrollArea>
				</div>
			</div>
		</div>
	);
};

export default ProfileList;
