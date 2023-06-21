import {
	ActionIcon,
	Group,
	Paper,
	Tooltip,
	Text,
	createStyles,
	Divider,
	Image,
	Stack,
	TextInput,
	Flex,
	ScrollArea,
	MultiSelect,
	rem,
	Box,
	CloseButton,
	Chip,
  Badge,
  Title,
  Center
} from "@mantine/core";
import {
	IconFlag,
	IconDeviceFloppy,
	IconDeviceMobile,
	IconId,
	IconLinkOff,
	IconUser,
	IconPlus,
  IconHomeCheck,
  IconBuildingSkyscraper,
  IconCar
} from "@tabler/icons-react";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import React, { useEffect, useState } from "react";
import { useStoreProfiles } from "../../../store/profilesStore";
import { ProfileData, TagData } from "../../../typings";
import TextEditor from "../../../components/TextEditor";

const useStyles = createStyles((theme) => ({
	action: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    }),
  },
}));

const ProfileInformation = (props: {onClick: (data: ProfileData | null) => void, saveProfile: (data: ProfileData | null) => void}) => {
  const { selectedProfile } = useStoreProfiles();
	const { classes, theme } = useStyles();
  
  const [availableTags, setAvailableTags] = useState<TagData[]>([]);
  const [selectedTagValues, setSelectedTagValues] = useState<string[]>([]);
  const [editorContent,setEditorContent] = useState(selectedProfile?.notes ? selectedProfile.notes : 'Place user information here...')


  useEffect(() => {
    const profileTags = selectedProfile ? selectedProfile.tags : [];
    const initialTagData = [{ value: "dangerous", label: "Dangerous", backgroundcolor: "#C92A2A" }, { value: "whatever", label: "Whatever", backgroundcolor: "#141517" }]
    setAvailableTags([...initialTagData, ...profileTags.filter((profileTag) => !initialTagData.some((initialTag) => initialTag.value === profileTag.value))]);
    setSelectedTagValues(selectedProfile ? selectedProfile?.tags.map(item => item.value) : [])
  }, [selectedProfile])

	function Value({ onRemove, label, backgroundcolor }: { value: string; label: string; backgroundcolor: string; onRemove(): void; }) {
		const colorForBackground = backgroundcolor;
		return (
			<div>
				<Box
					sx={(theme) => ({
						display: "flex",
						cursor: "default",
						alignItems: "center",
						backgroundColor: colorForBackground,
						border: `${rem(1)} solid ${
							theme.colorScheme === "dark"
								? theme.colors.dark[7]
								: theme.colors.gray[4]
						}`,
						paddingLeft: theme.spacing.xs,
						marginLeft: 5,
            marginTop: 5,
            marginBottom: 5,
						borderRadius: theme.radius.sm,
					})}
				>
					<Box sx={{ lineHeight: 1, fontSize: rem(12) }}>{label}</Box>
					<CloseButton
						onMouseDown={onRemove}
						variant='transparent'
						size={22}
						iconSize={14}
						tabIndex={-1}
					/>
				</Box>
			</div>
		);
	}

  const handleTagChange = (newTagValues: string[]) => {
    const removedTags = selectedTagValues.filter((value) => !newTagValues.includes(value));
    const addedTags = newTagValues.filter((value) => !selectedTagValues.includes(value));

    if (removedTags.length > 0) {
      handleTagRemove(removedTags[0]);
    } else if (addedTags.length > 0) {
      setSelectedTagValues(newTagValues);
    }
  };

  const handleTagRemove = (removedTagValue: string) => {
    setSelectedTagValues((prev) => prev.filter((value) => value !== removedTagValue));
  };

	return (
		<Paper p='md' withBorder style={{ width: '100%', height: 500, backgroundColor: 'rgb(34, 35, 37)' }}>
			<Group position='apart'>
				<Text weight={500}>Citizen</Text>
				<Group spacing={8} mr={0}>
					<Tooltip label='Save' withArrow color='dark' position='bottom'>
						<ActionIcon className={classes.action} onClick={() => { props.saveProfile(selectedProfile ? { ...selectedProfile, notes: editorContent, tags: availableTags.filter((tag) => selectedTagValues.includes(tag.value)) } : null) }} disabled={!selectedProfile}>
							<IconDeviceFloppy size={16} color={theme.colors.green[6]} />
						</ActionIcon>
					</Tooltip>
					<Tooltip label='Unlink' withArrow color='dark' position='bottom'>
						<ActionIcon className={classes.action} onClick={() => { props.onClick(null); }} disabled={!selectedProfile}>
							<IconLinkOff size={16} color={theme.colors.gray[5]} />
						</ActionIcon>
					</Tooltip>
				</Group>
			</Group>

			<Divider my='sm' />

			<Flex gap='md' justify='flex-start' direction='row' wrap='wrap'>
				<Flex gap='md' direction='row' wrap='wrap' w={628}>
					<Image
						width={260}
						height={180}
						src={selectedProfile ? selectedProfile.image : ""}
						alt='Placeholder for citizen picture'
						withPlaceholder
						//onClick={() => setCitizenPicture(true)}
					/>
					<Stack spacing='xs' w={350}>
						<TextInput
							icon={<IconId size={16} />}
              style={{backgroundColor: '#1d1e20'}}
							placeholder={selectedProfile ? selectedProfile.citizenid : "Citizen ID"}
							radius='xs'
							disabled
						/>
						<TextInput
							icon={<IconUser size={16} />}
              style={{backgroundColor: '#1d1e20'}}
							placeholder={selectedProfile ? selectedProfile.firstname + ' ' + selectedProfile.lastname : "Fullname"}
							radius='xs'
							disabled
						/>
						<TextInput
							icon={<IconFlag size={16} />}
              style={{backgroundColor: '#1d1e20'}}
							placeholder={selectedProfile ? selectedProfile.nationality : "Nationality"}
							radius='xs'
							disabled
						/>
						<TextInput
							icon={<IconDeviceMobile size={16} />}
              style={{backgroundColor: '#1d1e20'}}
							placeholder={selectedProfile ? selectedProfile.phone : "Phone number"}
							radius='xs'
							disabled
						/>
					</Stack>
					<TextEditor 
						key={selectedProfile?.citizenid} 
						initialContent={selectedProfile?.notes ? selectedProfile.notes : ''} 
						onChange={(value) => setEditorContent(value)} 
						styles={{ content: { backgroundColor: 'rgb(34, 35, 37)' }, toolbar: { backgroundColor: '#252628' }, controlsGroup: { pointerEvents: selectedProfile ? 'auto' : 'none', backgroundColor: selectedProfile ? '#1A1B1E' : '#282828' }}}
						contentAreaStyle={{ height: 170, width: 625, padding: 0 }}
					/>
				</Flex>
        <ScrollArea h={370}>
				  <Stack spacing={5} w={400}>
            {selectedProfile && <Title color="green.7" order={6}>Last Seen: Recently</Title>}
            <Text size='md' weight={500}>
              Tags
            </Text>
            <MultiSelect
              disabled={selectedProfile ? false : true}
              data={availableTags}
              value={selectedTagValues}
              onChange={handleTagChange}
              placeholder="Select or create tags"
              creatable
              searchable
              valueComponent={Value}
              getCreateLabel={(query) => `+ Create ${query}`}
              onCreate={(query) => {
                const [value, color] = query.split(":");
                const existingTag = availableTags.find((tag) => tag.value === value);
                if (existingTag) {
                  setSelectedTagValues((prev) => [...prev, existingTag.value]);
                } else {
                  const newTag = { value: value, label: value, backgroundcolor: color ? color : "#141517" };
                  setAvailableTags([...availableTags, newTag]);
                  setSelectedTagValues([...selectedTagValues, newTag.value]);
                  return newTag;
                }
							}}
            />
            <div>
              <Group spacing={5} mr={0}>
                <Text size='md' weight={500}>
                  Licenses
                </Text>
                <Tooltip
                  label='Create new license'
                  withArrow
                  color='dark'
                  position='bottom'
                >
                  <ActionIcon style={{ width: 18, minWidth: 0, minHeight: 0, height: rem(20) }} disabled={selectedProfile ? false : true}>
                    <IconPlus size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>

              <Group style={{ gap: 3 }}>
                {selectedProfile &&
                  selectedProfile.licenses.map((license, index) => (
                    <Chip key={index} defaultChecked variant='light' radius='xs' color={license.color}>
                      {license.licenseType}
                    </Chip>
                  ))
                }
              </Group>
            </div>

            <div>
              <Text size='md' weight={500} style={{marginBottom: 2}}>
                Employment
              </Text>

              <Group style={{ gap: 3 }}>
                {selectedProfile &&
                  selectedProfile.employment.map((job, index) => (
                    <Badge key={index} color="indigo" radius="xs" variant="dot" style={{height: '1.5rem'}}>{job.companyName} ({job.jobPosition})</Badge>
                  ))
                }
              </Group>
            </div>

            <div>
              <Text size='md' weight={500} style={{marginBottom: 2}}>
                Properties
              </Text>

              <Group style={{ gap: 3 }}>
                {selectedProfile &&
                  selectedProfile.properties.map((property, index) => (
                    <Badge key={index} style={{height: '1.5rem'}} radius="xs" color="teal" variant="dot">
                      <Center>
                        {property.type === 'House' ? <IconHomeCheck  size={18} style={{paddingRight: 5}} /> : <IconBuildingSkyscraper size={18} style={{paddingRight: 5}} /> }
                        {property.address} ({property.type})
                      </Center>
                    </Badge>
                  ))
                }
              </Group>
            </div>

            <div>
              <Text size='md' weight={500} style={{marginBottom: 2}}>
                Vehicles
              </Text>

              <Group style={{ gap: 3 }}>
                {selectedProfile &&
                  selectedProfile.vehicles.map((vehicle, index) => (
                    <Badge key={index} style={{height: '1.5rem'}} radius="xs" color={vehicle.color} variant="dot">
                      <Center>
                        <IconCar  size={18} style={{paddingRight: 5}} />
                        {vehicle.model} ({vehicle.plate})
                      </Center>
                    </Badge>
                  ))
                }
              </Group>
            </div>
				  </Stack>
        </ScrollArea>
			</Flex>
		</Paper>
	);
};

export default ProfileInformation;
