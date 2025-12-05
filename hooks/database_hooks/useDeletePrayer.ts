import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePrayer } from "../../storage/database";

const useDeletePrayer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deletePrayer(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prayers"] });
        },
    });
};

export default useDeletePrayer;
