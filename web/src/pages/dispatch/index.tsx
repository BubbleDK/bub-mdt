import React, { useState, useRef, useEffect } from "react";
import { MapContainer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import DispatchMarker from "./components/DispatchMarker";
import Map from "./components/Map";
import { createStyles, Group, Title, UnstyledButton, Tooltip, ScrollArea, TextInput, Button, Select, MultiSelect, Stack, Popover } from "@mantine/core";
import { useForm } from '@mantine/form';
import ActiveCalls from "./components/ActiveCalls";
import ActiveUnits from "./components/ActiveUnits";
import { IconPlus } from "@tabler/icons-react";
import { useNuiEvent } from "../../hooks/useNuiEvent";
import { useStoreDispatch } from '../../store/dispatchStore';
import { useStoreUnit } from '../../store/unitStore';
import { AlertData, OfficerData, UnitData } from "../../typings";
import { DndContext, DragOverlay, useSensors, MouseSensor, useSensor } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { IconCar, IconMoodSad } from "@tabler/icons-react";
import { useStoreOfficers } from "../../store/officersStore";
import { useStorePersonal } from "../../store/personalInfoStore";

const useStyles = createStyles((theme) => ({
	dispatchContainer: {
		display: "flex",
		gap: 15,
		margin: 20,
	},

	map: {
		height: "880px",
		width: "785px",
		border: "1px solid gray",
		backgroundColor: "rgb(125, 193, 220)",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		color: "whitesmoke",
		borderRadius: "5px",
	},

	activeCalls: {
		width: 350,
    backgroundColor: 'rgb(34, 35, 37)'
	},

  activeUnits: {
    width: 320,
    backgroundColor: 'rgb(34, 35, 37)'
  },

  headerBox: {
    color: "#b7b7b7",
    marginTop: 10,
    marginLeft: 12,
    marginRight: 12,
  }
}));

const customcrs = L.extend({}, L.CRS.Simple, {
	projection: L.Projection.LonLat,
	scale: function (zoom: number) {
		return Math.pow(2, zoom);
	},
	zoom: function (sc: number) {
		return Math.log(sc) / 0.6931471805599453;
	},
	distance: function (
		pos1: { lng: number; lat: number },
		pos2: { lng: number; lat: number }
	) {
		const x_difference = pos2.lng - pos1.lng;
		const y_difference = pos2.lat - pos1.lat;

		return Math.sqrt(x_difference * x_difference + y_difference * y_difference);
	},
	transformation: new L.Transformation(0.02072, 117.3, -0.0205, 172.8),
	infinite: false,
});

type RefType = {
  flyToPos: (coordsY: number, coordsX: number) => void;
}

const Dispatch = () => {
	const { classes } = useStyles();
  const { addAlert, removeAlert, addUnitToAlert, alerts } = useStoreDispatch();
  const { addUnit, units } = useStoreUnit();
  const { addOfficer, officers } = useStoreOfficers();
  const mapRef = useRef<RefType>(null);
  const [activeId, setActiveId] = useState(null);
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [officersSelector, setOfficersSelector] = useState<any>([]);
  const { citizenid } = useStorePersonal();

  useEffect(() => {
    const newArray = officers.map(el => ({value: el.citizenid, label: '(' +  el.callsign + ') | ' + el.firstname + ' ' + el.lastname, disabled: isOfficerAlreadyInAUnit(el.citizenid)}));
    setOfficersSelector(newArray)
  }, [officers, units])

  const removeAlertFunction = (id: number) => {
    setTimeout(() => {
      removeAlert(id);
    }, 1200000); // 20 minutes in ms
  }

  const flyToPosFunction = (coordsY: number, coordsX: number) => {
    mapRef.current?.flyToPos(coordsY, coordsX);
  }
  
  useNuiEvent('addOfficer', (data: OfficerData) => {
    addOfficer(data);
  });

  useNuiEvent('addUnit', (data: UnitData) => {
    addUnit(data);
  });

  useNuiEvent('addAlert', (data: AlertData) => {
    addAlert(data);
    removeAlertFunction(data.id);
  });

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }
  
  function handleDragEnd(event: any) {
    const {active, over} = event;
    if (over !== null) addUnitToAlert(over.id, units[units.findIndex((unit) => unit.id === activeId)])
    setActiveId(null);
  }

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10, } }),
  );

  const form = useForm({
    initialValues: {
      unitName: '',
      unitVehicle: '',
      unitOfficers: [citizenid],
    },

    validate: {
      unitName: (value) => (value.length === 0 ? 'Unit name is required' : units.some(el => el.unitName === value.toLocaleLowerCase()) ? 'Unit name already exist!' : null),
      unitVehicle: (value) => (value === '' ? 'You must pick a vehicle type' : null),
      unitOfficers: (value) => (value.length < 1 ? 'You must pick at least one officer' : null),
    },
  });

  const getHighestId = () => {
    const sortedArray = units.slice().sort((a, b) => {return a.id - b.id});
    let previousId = 0;
    for (let element of sortedArray) {
      if (element.id != (previousId + 1)) {
        return previousId + 1;
      }
      previousId = element.id;
    }
    return previousId + 1;
  }

  const handleSubmit = (props: UnitData) => {
    console.log(props)
    if (props.unitMembers.length === 0) return;
    addUnit(props);
    setPopoverOpened(false);
    form.reset();
  }
  
  const findUnitMembers = (ids: string[]) => {
    const res = [];
    for (let i = 0; i < ids.length; i++) {
      for (let j = 0; j < officers.length; j++) {
        if (ids[i] === officers[j].citizenid) {
          res.push(officers[j])
        }
      }
    }

    return res;
  }

  const isOfficerAlreadyInAUnit = (citizenid: string) => {
    for (let i = 0; i < units.length; i++) {
      console.log(units[i].unitMembers.findIndex(x => x.citizenid === citizenid))
      if (units[i].unitMembers.findIndex(x => x.citizenid === citizenid) !== -1) return true;
    }

    return false;
  }

	return (
		<div className={classes.dispatchContainer}>
			<div className={classes.map}>
				<MapContainer
					center={[0, -1024]}
					maxBoundsViscosity={1.0}
					zoom={6}
					maxZoom={6}
					minZoom={2}
					crs={customcrs}
					scrollWheelZoom={true}
				>
					<Map ref={mapRef} />
					<DispatchMarker alerts={alerts} />
				</MapContainer>
			</div>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
        <div className={classes.activeCalls}>
          <Group position="apart" className={classes.headerBox}>
            <Title order={6} c={'white'} fw={550}>
              Active Calls
            </Title>
          </Group>
          <div style={{padding: 10}}>
            <ScrollArea h={830} scrollbarSize={4} scrollHideDelay={500}>
              {alerts.length > 0 ? (
                <>
                  {alerts.map((alert, index) => (
                    <ActiveCalls key={index} alert={alert} parentFunction={flyToPosFunction} />
                  ))} 
                </>
              ) : (
                <Group position="center" style={{color: "#b7b7b7", margin: 10}}>
                  <Stack align="center" spacing="xs">
                    <Title order={6}>
                      No active calls found
                    </Title>
                    <IconMoodSad size={36} strokeWidth={1.5} />
                  </Stack>

                </Group>
              )}
            </ScrollArea>
          </div>
        </div>
        <div className={classes.activeUnits}>
          <Group position="apart" className={classes.headerBox} style={{paddingBottom: 14}}>
            <Title order={6} c={'white'} fw={550}>
              Units
            </Title>
            <Popover width={320} position="bottom" withArrow shadow="md" opened={popoverOpened} onChange={setPopoverOpened} transitionProps={{ transition: 'pop' }}>
              <Popover.Target>
                {isOfficerAlreadyInAUnit(citizenid) ? (
                  <Tooltip label="You are already a part of a unit" color="dark" position="bottom" withArrow>
                    <UnstyledButton sx={(theme) => ({borderRadius: theme.radius.sm, cursor: "pointer", "&:hover": {backgroundColor: theme.colors.dark[5]}})}>
                      <IconPlus size="1.4rem" stroke={1.5} />
                    </UnstyledButton>
                  </Tooltip>
                ) : (
                  <Tooltip label="Create new unit" color="dark" position="bottom" withArrow>
                    <UnstyledButton sx={(theme) => ({borderRadius: theme.radius.sm, cursor: "pointer", "&:hover": {backgroundColor: theme.colors.dark[5]}})} onClick={() => setPopoverOpened((o) => !o)}>
                      <IconPlus size="1.4rem" stroke={1.5} />
                    </UnstyledButton>
                  </Tooltip>
                )}
              </Popover.Target>

              <Popover.Dropdown sx={(theme) => ({ background: '#1d1e20' })}>
                <form onSubmit={form.onSubmit((values) => handleSubmit({id: getHighestId(), unitName: values.unitName.toLocaleLowerCase(), carModel: values.unitVehicle , unitMembers: findUnitMembers(values.unitOfficers), isOwner: citizenid}))}>
                  <TextInput placeholder="Eg. unit-1" label="Unit Name" data-autofocus withAsterisk {...form.getInputProps('unitName')} />

                  <Select
                    mt={10}
                    label="Unit Vehicle"
                    placeholder="Pick a vehicle"
                    data={['Interceptor', 'Buffalo', 'Cruiser', 'SUV', 'Dodge Charger']}
                    transitionProps={{ transition: 'pop-top-left', duration: 80, timingFunction: 'ease' }}
                    clearable
                    icon={<IconCar size="1rem" />}
                    withAsterisk
                    error="You have to specify the vehicle type"
                    {...form.getInputProps('unitVehicle')}
                  />

                  <MultiSelect
                    mt={10}
                    transitionProps={{ transition: 'pop-top-left', duration: 80, timingFunction: 'ease' }}
                    data={officersSelector}
                    label="Officers"
                    placeholder="Pick officers to your unit"
                    searchable
                    clearButtonProps={{ 'aria-label': 'Clear selection' }}
                    clearable
                    withAsterisk
                    nothingFound="Nothing found"
                    {...form.getInputProps('unitOfficers')}
                  />

                  <Group position="right" mt="md">
                    <Button variant="outline" color="green" type="submit">Create Unit</Button>
                  </Group>
                </form>
              </Popover.Dropdown>
            </Popover>
          </Group>
          {units.map((unit) => (
            <ActiveUnits key={unit.id} unitName={unit.unitName} unitMembers={unit.unitMembers} carModel={unit.carModel} id={unit.id} isOwner={unit.isOwner}/>
          ))}

          <DragOverlay dropAnimation={null} modifiers={[restrictToWindowEdges]}>
            {activeId ? (
              <ActiveUnits unitName={units[units.findIndex((unit) => unit.id === activeId)].unitName} unitMembers={units[units.findIndex((unit) => unit.id === activeId)].unitMembers} carModel={units[units.findIndex((unit) => unit.id === activeId)].carModel} id={units.findIndex((unit) => unit.id === activeId)} isOwner={units[units.findIndex((unit) => unit.id === activeId)].isOwner} />
            ) : null}
          </DragOverlay>
        </div>
      </DndContext>
		</div>
	);
};

export default Dispatch;
