import type { Charge } from "../../../typings";
import { mutate } from "../../mdt/api/request";
export const chargesApi = {
    create: (charge: Charge, category: string) => mutate("createCharge", { ...charge, category }),
    edit: (charge: Charge) =>
        mutate("editCharge", {
            chargelabel: charge.label,
            fine: charge.fine,
            time: charge.time,
            points: charge.points,
        }),
    remove: (label: string) => mutate("deleteCharge", { label }),
};
