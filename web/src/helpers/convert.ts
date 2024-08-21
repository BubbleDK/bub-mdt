import { Call, Unit, UnitsObject } from '../typings';

export interface CallsResponse extends Omit<Call, 'units'> {
  units: UnitsObject;
}

export const convertUnitsToArray = (units: UnitsObject): Unit[] => {
  if (!units) return [];
  return Object.entries(units).map((unit) => ({ id: +unit[0], ...unit[1] }));
};

export const convertCalls = (resp: { [key: string]: CallsResponse } | CallsResponse[]): Call[] => {
  if (Array.isArray(resp)) return resp.map((entry) => ({ ...entry, units: convertUnitsToArray(entry.units) }));
  return Object.entries(resp).map((entry: [string, CallsResponse]) => {
    const call: Call = { ...entry[1], units: [] };
    call.units = convertUnitsToArray(entry[1].units);

    return call;
  });
};