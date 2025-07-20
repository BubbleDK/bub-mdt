import { queryClient } from "../main";

export function removePages(queryKey: string[]) {
	queryClient.setQueriesData<{ pages: unknown[][]; pageParams: number[] }>(
		{ queryKey: queryKey },
		(data) => {
			if (!data) return;

			return {
				pages: data.pages.slice(0, 1),
				pageParams: data.pageParams.slice(0, 1),
			};
		}
	);
}
