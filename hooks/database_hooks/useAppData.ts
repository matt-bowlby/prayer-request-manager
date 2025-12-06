import { useQuery } from "@tanstack/react-query";
import { getAppData } from "../../storage/database";

const useAppData = () => {
	return useQuery({
		queryKey: ["appData"],
		queryFn: getAppData
	});
}

export default useAppData;