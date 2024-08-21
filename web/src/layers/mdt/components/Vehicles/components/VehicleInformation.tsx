import { ActionIcon, Button, Divider, Image, Indicator, Input, MultiSelect, Text, Tooltip, rem } from "@mantine/core"
import { IconBadgeTm, IconCar, IconEdit, IconId, IconInfoCircle, IconLinkOff, IconPalette, IconUserOff } from "@tabler/icons-react"
import TextEditor from "../../TextEditor"
import '../index.css'
import locales from "../../../../../locales"
import useVehiclesStore from "../../../../../stores/vehicles/vehicles"
import { fetchNui } from "../../../../../utils/fetchNui"
import { useState } from "react"
import { modals } from "@mantine/modals"
import AvatarModal from "../modals/AvatarModal"
import CreateBoloModal from "../../CreateBoloModal"
import { capitalizeFirstLetter } from "../../../../../helpers"

const VehicleInformation = () => {
  const { selectedVehicle, setSelectedVehicle, isVehicleBOLO, BOLOExpirationDate, setIsVehicleBOLO } = useVehiclesStore();
  const [hovering, setHovering] = useState(false);

  if (!selectedVehicle) return (
    <div className='vehicle-content-width'>
      <div className='card-background'>
        <div className="profile-no-selected">
          <IconUserOff size={rem(50)} color='white' />
          <Text style={{ fontSize: 15, color: 'white' }} weight={600}>
            {locales.no_vehicle_selected}
          </Text>
        </div>
      </div>
    </div>
  );

  return (
    <div className='vehicle-content-width'>
      <div className='card-background'>
        <div className='vehicle-card-content'>
          <div className='vehicle-card-header'>
            <Text style={{ fontSize: 17, color: "white" }} weight={500}>
              {locales.vehicle_information}
            </Text>

            <div className='vehicle-card-header-buttons'>
              <Tooltip label={locales.unlink} withArrow color='gray' position='bottom'>
                <ActionIcon variant="filled" color="gray" onClick={() => { setSelectedVehicle(null); }}>
                  <IconLinkOff size={16} color={'white'} />
                </ActionIcon>
              </Tooltip>
            </div>
          </div>


          <div className="vehicle-card-information">
            <div className="vehicle-card-image" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
              {hovering && (
                <ActionIcon
                  style={{ position: 'absolute', top: 5, right: 5, zIndex: 99 }}
                  onClick={() =>
                    modals.open({
                      title: <Text style={{ fontSize: 17, color: "white" }} weight={500}>{locales.change_picture}</Text>,
                      centered: true,
                      size: 'sm',
                      children: <AvatarModal />,
                    })
                  }
                >
                  <IconEdit />
                </ActionIcon>
              )}
              <Indicator label={<Text style={{ fontSize: 14, color: "white" }} weight={500}>{locales.bolo}</Text>} size={24} radius="sm" color="red" disabled={!isVehicleBOLO}>
                <Image 
                  src={selectedVehicle.image ? selectedVehicle.image : `https://gtahash.ru/cars/${selectedVehicle.class.toLowerCase()}/${selectedVehicle.model.toLowerCase()}.jpg`} 
                  radius={'lg'} 
                  height={225} 
                  width={500} 
                  withPlaceholder 
                  placeholder={
                    <Text align="center">
                      Image of vehicle was not found
                    </Text>
                  }
                />
              </Indicator>
            </div>
            
            <div className="vehicle-card-information-inputs">
              <Input
                disabled
                icon={<IconId size={16} />}
                placeholder={selectedVehicle.owner}
                size='sm'
              />

              <Input
                disabled
                icon={<IconBadgeTm size={16} />}
                placeholder={selectedVehicle.plate}
                size='sm'
              />

              <Input
                disabled
                icon={<IconInfoCircle size={16} />}
                placeholder={selectedVehicle.class === 'Sport-Classic' ? capitalizeFirstLetter('Sports Classic') : capitalizeFirstLetter(selectedVehicle.class)}
                size='sm'
              />

              <Input
                disabled
                icon={<IconCar size={16} />}
                placeholder={capitalizeFirstLetter(selectedVehicle.model)}
                size='sm'
              />

              <Input
                disabled
                icon={<IconPalette size={16} />}
                placeholder={capitalizeFirstLetter(selectedVehicle.color)}
                size='sm'
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            {isVehicleBOLO && (
              <Text style={{ fontSize: 14, color: "red" }} weight={500}>{locales.bolo_expires_at} {BOLOExpirationDate}</Text>
            )}

            <Button 
              variant="light" 
              color={isVehicleBOLO ? 'green' : 'red'} 
              onClick={() =>
                !isVehicleBOLO ?
                  modals.open({
                    title: <Text style={{ fontSize: 17, color: "white" }} weight={500}>{locales.create_bolo}</Text>,
                    centered: true,
                    size: 'lg',
                    children: <CreateBoloModal plate={selectedVehicle.plate} />,
                  })
                :
                  modals.openConfirmModal({
                    title: <Text style={{ fontSize: 17, color: "white" }} weight={500}>{locales.delete_bolo}</Text>,
                    size: 'sm',
                    centered: true,
                    labels: { confirm: locales.confirm, cancel: locales.cancel },
                    groupProps: {
                      spacing: 6,
                    },
                    confirmProps: { color: 'red' },
                    onConfirm: async () => {
                      await fetchNui('deleteBOLO', { plate: selectedVehicle.plate }, { data: 1 })
                      setIsVehicleBOLO(false);
                    },
                    children: (
                      <Text size="sm" c="dark.2">
                        {locales.delete_bolo_confirm.format(selectedVehicle.plate)}
                      </Text>
                    ),
                  })
              }
            >
              {isVehicleBOLO ? locales.mark_unwanted : locales.mark_wanted}
            </Button>
          </div>

          <Divider w={'100%'} />

          <div className="vehicle-card-extra-information">
            <Text style={{ fontSize: 17, color: "white" }} weight={500}>
              {locales.known_information}
            </Text>

            <MultiSelect
              data={selectedVehicle.knownInformation}
              defaultValue={selectedVehicle.knownInformation}
              placeholder={locales.select_items}
              w={'100%'}
              searchable
              creatable
              styles={{ value: { backgroundColor: '#343a40' }}}
              getCreateLabel={(query) => `+ Create ${query}`}
              onCreate={(query) => {
                fetchNui(
                  'saveVehicleInformation',
                  {
                    plate: selectedVehicle.plate,
                    knownInformation: [...selectedVehicle.knownInformation, query]
                  },
                  { data: 1 }
                );
                const updatedVehicle = {
                  ...selectedVehicle,
                  knownInformation: [...selectedVehicle.knownInformation, query]
                };
                setSelectedVehicle(updatedVehicle);
                return query;
              }}
            />
          </div>

          <Divider w={'100%'} />

          <div className="vehicle-card-notes">
            <TextEditor 
              content={selectedVehicle.notes}
              onSave={(value) => {
                setSelectedVehicle({ ...selectedVehicle, notes: value });

                fetchNui('saveVehicleNotes', { plate: selectedVehicle.plate, notes: value });
              }}
              styles={{ content: { backgroundColor: '#242527' }, toolbar: { backgroundColor: '#2C2E33' }, controlsGroup: { pointerEvents: 'auto', backgroundColor: '#282828' }}}
              contentAreaStyle={{ height: 270, width: '100%', padding: 0 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleInformation