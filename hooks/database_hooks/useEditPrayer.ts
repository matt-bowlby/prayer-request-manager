import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editPrayer } from "../../storage/database";

const useEditPrayer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updatedFields }: { id: number; updatedFields: Partial<Prayer> }) =>
            editPrayer(id, updatedFields),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prayers"] });
        },
    });
};

export default useEditPrayer;
