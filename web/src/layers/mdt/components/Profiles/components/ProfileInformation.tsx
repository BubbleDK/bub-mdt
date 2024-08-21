import { Tooltip, ActionIcon, Divider, Input, Image, Text, rem } from "@mantine/core"
import { IconLinkOff, IconId, IconUserSquareRounded, IconCalendarEvent, IconDeviceMobile, IconFingerprint, IconUserOff, IconEdit } from "@tabler/icons-react"
import TextEditor from "../../TextEditor"
import '../index.css'
import dayjs from "dayjs"
import { useProfilesStore } from "../../../../../stores"
import { fetchNui } from "../../../../../utils/fetchNui"
import locales from "../../../../../locales"
import { useState } from "react"
import { modals } from "@mantine/modals"
import AvatarModal from "./modals/AvatarModal"

const ProfileInformation = () => {
  const { selectedProfile, setSelectedProfile, isProfileWanted } = useProfilesStore();
  const [hovering, setHovering] = useState(false);

  if (!selectedProfile) return (
    <div className='content-width'>
      <div className='card-background'>
        <div className="profile-no-selected">
          <IconUserOff size={rem(50)} color='white' />
          <Text style={{ fontSize: 15, color: 'white' }} weight={600}>
            {locales.no_profile_selected}
          </Text>
        </div>
      </div>
    </div>
  );

  return (
    <div className='content-width'>
      <div className='card-background'>
        <div className='profile-card-content'>
          <div className='profile-card-header'>
            <Text style={{ fontSize: 14, color: 'white' }}>
              {locales.edit_citizen} #{selectedProfile.citizenid}
            </Text>

            <div className='profile-card-header-buttons'>
              <Tooltip label='Unlink' withArrow color='gray' position='bottom'>
                <ActionIcon variant="filled" color="gray" onClick={() => { setSelectedProfile(null); }}>
                  <IconLinkOff size={16} color={'white'} />
                </ActionIcon>
              </Tooltip>
            </div>
          </div>

          <Divider style={{ width: '100%' }} />
          
          <div className='profile-card-profile-content'>
            <div className='profile-card-wrapper'>
              <div className="profile-card-image" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
                {hovering && (
                  <ActionIcon
                    style={{ position: 'absolute', top: 5, right: 5, zIndex: 99 }}
                    onClick={() =>
                      modals.open({
                        title: <Text style={{ fontSize: 17, color: "white" }} weight={500}>{locales.change_picture}</Text>,
                        centered: true,
                        size: 'sm',
                        children: <AvatarModal image={selectedProfile.image} />,
                      })
                    }
                  >
                    <IconEdit />
                  </ActionIcon>
                )}
                <Image width={145} height={180} src={selectedProfile.image ?? 'https://r2.fivemanage.com/s64hZD0G9WtYHbURWCuSc/placeholder.jpg'} radius={'md'} alt="With default placeholder" withPlaceholder />
                {isProfileWanted && <Image className='watermark' src={'https://r2.fivemanage.com/s64hZD0G9WtYHbURWCuSc/wanted-stamp.png'} radius={'md'} alt="With default placeholder" withPlaceholder /> }
              </div>

              <div className='profile-card-inputs'>
                <Input
                  disabled
                  icon={<IconId size={16} />}
                  placeholder={selectedProfile.citizenid}
                  size='xs'
                />

                <Input
                  disabled
                  icon={<IconUserSquareRounded size={16} />}
                  placeholder={selectedProfile.firstname + ' ' + selectedProfile.lastname}
                  size='xs'
                />

                <Input
                  disabled
                  icon={<IconCalendarEvent size={16} />}
                  placeholder={dayjs(selectedProfile.dob).format('DD/MM/YYYY')}
                  size='xs'
                />

                <Input
                  disabled
                  icon={<IconDeviceMobile size={16} />}
                  placeholder={selectedProfile.phoneNumber}
                  size='xs'
                /> 

                <Input
                  disabled
                  icon={<IconFingerprint size={16} />}
                  placeholder={selectedProfile.fingerprint ?? 'No fingerprint found'}
                  size='xs'
                /> 
              </div>
            </div>

            <Divider style={{ width: '100%' }} />

            <div className='profile-card-information'>
              <TextEditor 
                content={selectedProfile.notes}
                onSave={(value) => {
                  setSelectedProfile({ ...selectedProfile, notes: value });

                  fetchNui('saveProfileNotes', { citizenid: selectedProfile.citizenid, notes: value });
                }}
                styles={{ content: { backgroundColor: '#242527' }, toolbar: { backgroundColor: '#2C2E33' }, controlsGroup: { pointerEvents: 'auto', backgroundColor: '#282828' }}}
                contentAreaStyle={{ height: 475, width: 413, padding: 0 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileInformation