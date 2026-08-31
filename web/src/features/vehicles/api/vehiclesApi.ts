import type { Vehicle } from "../../../typings";
import useVehiclesStore, { DEBUG_VEHICLE1 } from "../../../stores/vehicles/vehicles";
import { fetchNui } from "../../../utils/fetchNui";
import { mutate } from "../../mdt/api/request";
import { isEnvBrowser } from "../../../utils/misc";

type VehicleRecord = { vehicle: Vehicle; bolo: boolean; expires: string };
const previews = new Map<string, VehicleRecord>();
const updatePreview = (plate: string, update: (record: VehicleRecord) => VehicleRecord) => {
    const record = previews.get(plate);
    if (isEnvBrowser() && record) previews.set(plate, update(record));
};

export const vehiclesApi = {
    list: () => useVehiclesStore.getState().getVehicles(),
    async get(plate: string) {
        if (isEnvBrowser() && previews.has(plate)) return previews.get(plate)!;
        const [vehicle, bolo] = await Promise.all([
            fetchNui<Vehicle>("getVehicle", { plate }, { data: { ...DEBUG_VEHICLE1, plate } }),
            fetchNui<boolean>("isVehicleBOLO", { plate }, { data: false }),
        ]);
        const expires = bolo
            ? await fetchNui<string>("getBOLOExpirationDate", { plate }, { data: "" })
            : "";
        if (!vehicle) throw new Error("Vehicle record not found.");
        const record = { vehicle, bolo, expires };
        if (isEnvBrowser()) previews.set(plate, record);
        return record;
    },
    async notes(plate: string, notes: string) {
        await mutate("saveVehicleNotes", { plate, notes });
        updatePreview(plate, (record) => ({ ...record, vehicle: { ...record.vehicle, notes } }));
    },
    async image(plate: string, image: string) {
        await mutate("updateVehicleImage", { plate, image });
        updatePreview(plate, (record) => ({ ...record, vehicle: { ...record.vehicle, image } }));
    },
    async information(plate: string, knownInformation: string[]) {
        await mutate("saveVehicleInformation", { plate, knownInformation });
        updatePreview(plate, (record) => ({
            ...record,
            vehicle: { ...record.vehicle, knownInformation },
        }));
    },
    async createBolo(plate: string, reason: string, expirationDate: string) {
        await mutate("createBOLO", { plate, reason, expirationDate });
        updatePreview(plate, (record) => ({ ...record, bolo: true, expires: expirationDate }));
    },
    async deleteBolo(plate: string) {
        await mutate("deleteBOLO", { plate });
        updatePreview(plate, (record) => ({ ...record, bolo: false, expires: "" }));
    },
};
