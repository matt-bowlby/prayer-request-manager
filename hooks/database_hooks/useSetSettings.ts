import { QueryClient, useMutation } from "@tanstack/react-query";
import { setSettings } from "../../storage/database";

const useSetSettings = () => {
	const queryClient = new QueryClient();

	return useMutation({
		mutationFn: (newSettings: Partial<Settings>) => setSettings(newSettings),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["appData"] });
		},
	});
}

export default useSetSettings;