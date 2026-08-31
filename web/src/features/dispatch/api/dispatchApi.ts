import type { Officer, UnitType } from "../../../typings";
import { fetchNui } from "../../../utils/fetchNui";
import useOfficerStore from "../../../stores/officersStore";
import { mutate } from "../../mdt/api/request";
import { isEnvBrowser } from "../../../utils/misc";
import useUnitStore from "../../../stores/dispatch/units";
import { useCallsStore } from "../../../stores/dispatch/calls";
import usePersonalDataStore from "../../../stores/personalDataStore";
export const dispatchApi = {
    waypoint: (coords: [number, number]) => mutate("setWaypoint", coords),
    async respond(id: number, attached: boolean) {
        await mutate(attached ? "detachFromCall" : "respondToCall", id);
        if (isEnvBrowser()) {
            const unit = useUnitStore
                .getState()
                .units.find(
                    (item) => item.id === usePersonalDataStore.getState().personalData.unit
                );
            const store = useCallsStore.getState();
            const call = store.calls.find((item) => item.id === id);
            if (unit && call)
                store.updateCallUnits(
                    id,
                    attached
                        ? call.units.filter((item) => item.id !== unit.id)
                        : [...call.units.filter((item) => item.id !== unit.id), unit]
                );
        }
    },
    async create(type: UnitType) {
        const result = await fetchNui<{ id: number; name: string }>("createUnit", type, {
            data: { id: Date.now(), name: "New unit" },
        });
        if (!result || !Number.isInteger(result.id) || result.id <= 0)
            throw new Error("The unit could not be created.");
        if (isEnvBrowser()) {
            const store = useUnitStore.getState();
            store.setUnits([...store.units, { ...result, type, members: [] }]);
        }
        return result;
    },
    leave: () => mutate("leaveUnit", { data: 1 }),
    async members(id: number, officers: string[]) {
        await mutate("setUnitOfficers", { id, officers });
        if (isEnvBrowser()) {
            const store = useUnitStore.getState();
            store.setUnits(
                store.units.map((unit) =>
                    unit.id === id
                        ? {
                              ...unit,
                              members: useOfficerStore
                                  .getState()
                                  .activeOfficers.filter((officer) =>
                                      officers.includes(String(officer.playerId))
                                  ),
                          }
                        : unit
                )
            );
        }
    },
    async officers(): Promise<Officer[]> {
        const officers = Object.values(
            await fetchNui<Officer[]>("getActiveOfficers", null, {
                data: useOfficerStore.getState().activeOfficers,
            })
        );
        useOfficerStore.setState({ activeOfficers: officers });
        return officers;
    },
};
