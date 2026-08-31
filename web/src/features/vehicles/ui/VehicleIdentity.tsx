import { useState } from "react";
import { Camera, CarFront, Fingerprint, UserRound } from "lucide-react";
import type { Vehicle } from "../../../typings";

export function VehicleIdentity({ vehicle, onImage }: { vehicle: Vehicle; onImage: () => void }) {
    const [imageFailed, setImageFailed] = useState(false);
    return (
        <section className="vehicle-identity" aria-label="Registration record">
            <div className="vehicle-identity-data">
                <span className="vehicle-section-label">
                    <Fingerprint size={14} />
                    Registration / Identification
                </span>
                <div className="vehicle-license">
                    <span>LOS SANTOS</span>
                    <strong>{vehicle.plate}</strong>
                    <small>VEHICLE REGISTRATION</small>
                </div>
                <h2>{vehicle.model}</h2>
                <dl className="vehicle-specifications">
                    <div>
                        <dt>Vehicle class</dt>
                        <dd>{vehicle.class || "Not recorded"}</dd>
                    </div>
                    <div>
                        <dt>Registered color</dt>
                        <dd>{vehicle.color || "Not recorded"}</dd>
                    </div>
                </dl>
                <div className="vehicle-owner">
                    <UserRound size={19} />
                    <div>
                        <span>Registered owner</span>
                        <strong>{vehicle.owner || "Not recorded"}</strong>
                    </div>
                </div>
            </div>
            <div className="vehicle-photo">
                {vehicle.image && !imageFailed ? (
                    <img
                        src={vehicle.image}
                        alt={`${vehicle.model} · ${vehicle.plate}`}
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <div className="vehicle-photo-empty">
                        <CarFront size={120} strokeWidth={0.7} />
                        <span>
                            {imageFailed ? "Vehicle image unavailable" : "No identification photo"}
                        </span>
                        <p>Add a photo to help officers recognize this vehicle.</p>
                    </div>
                )}
                <button onClick={onImage}>
                    <Camera size={15} />
                    {vehicle.image ? "Update vehicle image" : "Add vehicle image"}
                </button>
            </div>
        </section>
    );
}
