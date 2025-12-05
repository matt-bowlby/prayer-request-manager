import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPrayer } from "../../storage/database";

const useAddPrayer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (prayer: Prayer) => addPrayer(prayer),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prayers"] });
        },
    });
};

export default useAddPrayer;
