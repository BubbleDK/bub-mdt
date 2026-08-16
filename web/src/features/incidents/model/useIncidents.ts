import { useQuery } from "@tanstack/react-query";
import { fetchIncident, fetchIncidents } from "../api/incidentsApi";

export function useIncidentSearch() {
    return useQuery({ queryKey: ["incidents"], queryFn: fetchIncidents });
}

export function useIncident(id: number) {
    return useQuery({
        queryKey: ["incident", id],
        queryFn: () => fetchIncident(id),
        enabled: Number.isFinite(id),
    });
}
