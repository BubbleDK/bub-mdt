import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CarFront, ScanLine } from "lucide-react";
import type { PartialVehicleData } from "../../../typings";
import { Empty, SearchField, Status } from "../../mdt/ui/Workspace";

export function VehicleRegistry({
    vehicles,
    loading,
    onOpen,
}: {
    vehicles: PartialVehicleData[];
    loading: boolean;
    onOpen: (plate: string) => void;
}) {
    const [search, setSearch] = useState("");
    const reducedMotion = useReducedMotion();
    const filtered = vehicles.filter((vehicle) =>
        `${vehicle.plate} ${vehicle.model}`.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <>
            <section className="vehicle-lookup">
                <div className="vehicle-lookup-heading">
                    <ScanLine size={23} />
                    <div>
                        <h2>Start with the plate.</h2>
                        <p>
                            Search a registration or model to identify a vehicle and review its
                            record.
                        </p>
                    </div>
                    <span>{loading ? "—" : vehicles.length} registrations</span>
                </div>
                <SearchField
                    value={search}
                    onChange={setSearch}
                    placeholder="Search plate or model"
                />
            </section>
            <div className="vehicle-registry-heading">
                <span>Registration index</span>
                <span>
                    {loading
                        ? "Loading registrations…"
                        : `${filtered.length} ${filtered.length === 1 ? "match" : "matches"}`}
                </span>
            </div>
            <div className="vehicle-registry-grid" aria-busy={loading}>
                <Status pending={loading} />
                <AnimatePresence initial={false} mode="popLayout">
                    {filtered.map((vehicle, index) => (
                        <motion.button
                            layout={reducedMotion ? false : "position"}
                            initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, transition: { duration: reducedMotion ? 0 : 0.1 } }}
                            transition={{
                                duration: reducedMotion ? 0 : 0.22,
                                delay: reducedMotion ? 0 : Math.min(index, 5) * 0.025,
                                layout: { duration: reducedMotion ? 0 : 0.22 },
                            }}
                            className="vehicle-registry-card"
                            key={vehicle.plate}
                            onClick={() => onOpen(vehicle.plate)}
                        >
                            <div className="vehicle-registry-card-top">
                                <CarFront size={19} strokeWidth={1.4} />
                                <span>Vehicle record</span>
                                <ArrowUpRight size={16} />
                            </div>
                            <span className="registry-plate">{vehicle.plate}</span>
                            <div className="vehicle-registry-card-bottom">
                                <strong>{vehicle.model}</strong>
                                <span>View registration</span>
                            </div>
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>
            {!filtered.length && !loading && (
                <Empty>
                    {search
                        ? "No matching registrations. Try part of a plate or a different model."
                        : "No vehicles are registered."}
                </Empty>
            )}
        </>
    );
}
