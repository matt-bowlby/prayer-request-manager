import { QueryClient, useMutation } from "@tanstack/react-query";
import { setAppData } from "../../storage/database";

const useSetAppData = () => {
	const queryClient = new QueryClient();

	return useMutation({
		mutationFn: (newAppData: Partial<AppData>) => setAppData(newAppData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["appData"] });
		},
	});
}

export default useSetAppData;