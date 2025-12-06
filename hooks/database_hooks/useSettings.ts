import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../storage/database";

const useSettings = () => {
    return useQuery({
        queryKey: ["settings"],
        queryFn: getSettings,
    });
};

export default useSettings;
