import { useNuiEvent } from "../../../hooks/useNuiEvent";
import type {
    Call,
    Character,
    Charge,
    Config,
    CustomProfileData,
    Incident,
    Officer,
    Report,
    UnitsObject,
} from "../../../typings";
import { useQueryClient } from "@tanstack/react-query";
import { consumeCameraTarget } from "../api/camera";
import { reportsApi } from "../../reports/api/reportsApi";
import { useLocaleStore } from "../../../stores/localeStore";
import useConfigStore from "../../../stores/configStore";
import useProfilesStore from "../../../stores/profilesStore";
import usePersonalDataStore from "../../../stores/personalDataStore";
import useAppVisibilityStore from "../../../stores/appVisibilityStore";
import useChargeStore from "../../../stores/chargesStore";
import { useCallsStore } from "../../../stores/dispatch/calls";
import useUnitStore from "../../../stores/dispatch/units";
import useOfficerStore from "../../../stores/officersStore";
import { convertUnitsToArray } from "../../../helpers";

/** One subscription per runtime event, independent of how many tabs are open. */
export function useRuntimeEvents() {
    const cache = useQueryClient();
    const finishCapture = (
        type: "report" | "incident",
        data: { imageLabel: string; imageURL: string }
    ) => {
        const target = consumeCameraTarget(type);
        if (!target) return;
        cache.setQueryData<Report | Incident>([type, target.id], (previous) => {
            if (!previous) return previous;
            const next = {
                ...previous,
                evidence: [...previous.evidence, { label: data.imageLabel, image: data.imageURL }],
            } as Report | Incident;
            if (type === "report") reportsApi.remember(next as Report);
            return next;
        });
    };
    useNuiEvent("updateReportEvidence", (data: { imageLabel: string; imageURL: string }) =>
        finishCapture("report", data)
    );
    useNuiEvent("updateIncidentEvidence", (data: { imageLabel: string; imageURL: string }) =>
        finishCapture("incident", data)
    );
    useNuiEvent("setConfig", (data: { config: Config }) =>
        useConfigStore.getState().setConfig(data.config)
    );
    useNuiEvent(
        "setInitData",
        (data: {
            profileCards: CustomProfileData[];
            charges: Record<string, Charge[]>;
            locale?: string;
            locales?: Record<string, string>;
        }) => {
            useProfilesStore.getState().setProfileCards(data.profileCards);
            useChargeStore.getState().setCharges(data.charges);
            useLocaleStore.getState().initialize(data.locale ?? "en", data.locales ?? {});
        }
    );
    useNuiEvent("openMDT", (data: { personalData: Character }) => {
        usePersonalDataStore.getState().setPersonalData(data.personalData);
        useAppVisibilityStore.getState().show();
    });
    useNuiEvent("setVisible", (data: { visible: boolean }) =>
        useAppVisibilityStore.getState().setVisibility(data.visible)
    );
    useNuiEvent("refreshUnits", (data: UnitsObject) =>
        useUnitStore.getState().setUnits(convertUnitsToArray(data))
    );
    useNuiEvent("updateCalls", (data: { calls: Call[] }) =>
        useCallsStore.getState().setCalls(data.calls)
    );
    useNuiEvent("addCall", (data: Call) => {
        const store = useCallsStore.getState();
        store.setCalls([data, ...store.calls.filter((call) => call.id !== data.id)]);
    });
    useNuiEvent("setCallUnits", (data: { id: number; units: UnitsObject }) =>
        useCallsStore.getState().updateCallUnits(data.id, convertUnitsToArray(data.units))
    );
    useNuiEvent("editCallUnits", (data: { id: number; units: UnitsObject }) =>
        useCallsStore.getState().updateCallUnits(data.id, convertUnitsToArray(data.units))
    );
    useNuiEvent("updateOfficerPositions", (data: Officer[]) =>
        useOfficerStore.setState({ activeOfficers: data })
    );
}
