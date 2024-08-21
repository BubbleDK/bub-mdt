import { rem, Input, Divider, Text, Image, ScrollArea, Center, Loader } from "@mantine/core"
import { IconUsers, IconSearch } from "@tabler/icons-react"
import '../index.css'
import { useState, useEffect } from "react"
import dayjs from "dayjs"
import { PartialProfileData } from "../../../../../typings"
import { useProfilesStore } from "../../../../../stores"
import locales from "../../../../../locales"

interface ProfileListProps {
  handleProfileClick: (profile: PartialProfileData) => void
}

const ProfileList = (props: ProfileListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const getProfiles = useProfilesStore((state) => state.getPlayers);
  const [profiles, setProfiles] = useState<PartialProfileData[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<PartialProfileData[]>(profiles);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      return await getProfiles();
    };

    fetchData().then((data) => {
      setProfiles(data.profiles);
      setFilteredProfiles(data.profiles);
      setIsLoading(false);
    });
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProfiles(profiles);
    } else {
      const results = profiles.filter(profile => 
        (profile.citizenid || '').includes(searchQuery) ||
        (profile.firstname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (profile.lastname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (profile.firstname + ' ' + profile.lastname || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProfiles(results);
    }
}, [searchQuery, filteredProfiles]);

  return (
    <div className='content-width'>
      <div className='card-background'>
        <div className='card-title'>
          <Text style={{ fontSize: 17, color: "white" }} weight={500}>
            {locales.profiles}
          </Text>

          <IconUsers size={rem(25)} color='white' />
        </div>

        <Input
          icon={<IconSearch />}
          variant="filled"
          placeholder={locales.search}
          mt={10}
          mb={10}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <Divider mt={5} mb={5} />

        <div className='profiles-card-content'>
          <ScrollArea h={860}>
            <div className="profiles-card-content-flex">
            {isLoading ? (
              <Center h={'100%'}>
                <Loader />
              </Center>
            ) : filteredProfiles.length > 0 ? (
              filteredProfiles.map((profile) => (
                <div className='profile-card' onClick={() => props.handleProfileClick(profile)} key={profile.citizenid}>
                  <Image width={65} height={65} src={profile.image ?? 'https://cdn.vectorstock.com/i/preview-1x/97/68/account-avatar-dark-mode-glyph-ui-icon-vector-44429768.jpg'} radius={'lg'} alt="With default placeholder" withPlaceholder />

                  <div>
                    <Text weight={600} style={{ fontSize: 13, color: 'white' }}>
                      {profile.firstname} {profile.lastname}
                    </Text>

                    <Text style={{ fontSize: 12, color: 'white' }}>
                      {locales.dob}: {dayjs(profile.dob).format('DD/MM/YYYY')}
                    </Text>
                    
                    <Text style={{ fontSize: 12, color: 'white' }}>
                      {locales.citizen_id}: {profile.citizenid}
                    </Text>
                  </div>
                </div>
              ))
            ) : (
              <Text color='dimmed' size='xs'>
                {locales.no_profiles_found}
              </Text>
            )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default ProfileList