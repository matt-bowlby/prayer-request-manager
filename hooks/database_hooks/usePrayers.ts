import { useQuery } from "@tanstack/react-query";
import { getPrayers } from "../../storage/database";

const usePrayers = () => {
    return useQuery({
        queryKey: ["prayers"],
        queryFn: getPrayers,
    });
};

export default usePrayers;
