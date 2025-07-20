import { Center, Input, Loader, ScrollArea, Stack, Text } from "@mantine/core";
import React, { useEffect, useMemo, useState } from "react";
import { modals } from "@mantine/modals";
import { IconSearch, IconUserX } from "@tabler/icons-react";
import { PartialProfileData } from "../../../../../../typings";
import { fetchNui } from "../../../../../../utils/fetchNui";
import useReportStore from "../../../../../../stores/reports/report";
import locales from "../../../../../../locales";
import { removePages } from "../../../../../../helpers/removePages";
import { useProfilesQuery } from "../../../../../../stores/profilesStore";
import { useInfiniteScroll } from "../../../../../../hooks/useInfiniteScroll";

const AddCitizenModal: React.FC = () => {
	const { report, setCitizensInvolved } = useReportStore();
	const [searchQuery, setSearchQuery] = useState("");
	const { data, fetchNextPage, isFetching, isDebouncing } =
		useProfilesQuery(searchQuery);
	const { ref } = useInfiniteScroll(() => fetchNextPage());

	useEffect(() => {
		return () => removePages(["profiles"]);
	}, []);

	const pages = useMemo(() => {
		if (!data) return [];
		return data.pages.flatMap((page) => page.profiles);
	}, [data]);

	const handleSubmit = async (citizen: PartialProfileData) => {
		if (report.citizensInvolved.some((o) => o.citizenid === citizen.citizenid))
			return modals.closeAll();

		await fetchNui(
			"addReportCitizen",
			{ id: report.id, citizenid: citizen.citizenid },
			{ data: 1 }
		);
		modals.closeAll();
		setCitizensInvolved((prev) => {
			if (prev.some((c) => c.citizenid === citizen.citizenid)) {
				return prev;
			}
			return [
				...prev,
				{
					...citizen,
				},
			];
		});
	};

	return (
		<form>
			<Input
				icon={<IconSearch />}
				variant='filled'
				placeholder={locales.search}
				mt={10}
				mb={10}
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>

			{isDebouncing || isFetching ? (
				<Center>
					<Loader />
				</Center>
			) : pages.length > 0 ? (
				<ScrollArea h={280}>
					<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
						{pages.map((profile, i) => (
							<div
								ref={i === pages.length - 2 ? ref : null}
								className='add-officer-card'
								onClick={() => handleSubmit(profile)}
								key={profile.citizenid}
							>
								<Text weight={500} style={{ fontSize: 13, color: "white" }}>
									{profile.firstname} {profile.lastname}
								</Text>

								<Text style={{ fontSize: 13, color: "white" }}>
									{locales.citizen_id}: {profile.citizenid}
								</Text>
							</div>
						))}
					</div>
				</ScrollArea>
			) : (
				<Stack spacing={0} c='dark.2' justify='center' align='center'>
					<IconUserX size={36} />
					<Text size='xl'>{locales.no_citizens_found}</Text>
				</Stack>
			)}
		</form>
	);
};

export default AddCitizenModal;
