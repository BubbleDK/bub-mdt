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
  Title
} from "@mantine/core";
import {
	IconFlag,
	IconDeviceFloppy,
	IconDeviceMobile,
	IconId,
	IconLinkOff,
	IconUser,
	IconPlus,
	IconChevronDown,
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

const useStyles = createStyles((theme) => ({
	action: {
		backgroundColor: theme.colors.dark[2],
		...theme.fn.hover({
			backgroundColor:
				theme.colorScheme === "dark"
					? theme.colors.dark[5]
					: theme.colors.gray[1],
		}),
	},
}));

interface ItemProps {
	value: string;
	label: string;
	backgroundcolor: string;
	onRemove(): void;
}

const ProfileInformation = (props: {onClick: (data: ProfileData | null) => void}) => {
  const { selectedProfile, setProfile } = useStoreProfiles();
	const { classes, theme } = useStyles();
  const [tagData, setTagData] = useState<TagData[]>([]);
  const [tagValues, setTagValues] = useState<string[]>([])
  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Underline,
        Link,
        Superscript,
        SubScript,
        Highlight,
        Color,
        TextStyle,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
      ],
      editable: selectedProfile ? true : false,
      content: 'Place user information here...',
    }
  );
  const initialTagData = [{ value: "dangerous", label: "Dangerous", backgroundcolor: "#C92A2A" }, { value: "whatever", label: "Whatever", backgroundcolor: "#141517" }]

  useEffect(() => {
    setTagValues([]);
    setTagData(initialTagData);
    editor?.commands.setContent(selectedProfile?.notes || 'Place user information here...');
    editor?.setEditable(selectedProfile ? true : false);
    selectedProfile?.tags.map(item => { 
      const tagExist = tagData.some(tag => tag.value === item.value);

      if (!tagExist) setTagData([...tagData, item])
    })
    setTagValues(selectedProfile ? selectedProfile?.tags.map(item => item.value) : [])
  }, [selectedProfile])

  useEffect(() => {
    return () => {
      // Reset selected profile state when component unmounts
      setProfile(null);
    };
  }, []);

	function Value({ value, label, onRemove, backgroundcolor }: ItemProps) {
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

	return (
		<Paper p='md' withBorder style={{ width: 1110, height: 450 }}>
			<Group position='apart'>
				<Text weight={500}>Citizen</Text>
				<Group spacing={8} mr={0}>
					<Tooltip label='Save' withArrow color='dark' position='bottom'>
						<ActionIcon className={classes.action} onClick={() => { }} disabled={!selectedProfile}>
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
				<Flex gap='md' direction='row' wrap='wrap' w={630}>
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
							placeholder={selectedProfile ? selectedProfile.citizenid : "Citizen ID"}
							radius='xs'
							disabled
						/>
						<TextInput
							icon={<IconUser size={16} />}
							placeholder={selectedProfile ? selectedProfile.firstname + ' ' + selectedProfile.lastname : "Fullname"}
							radius='xs'
							disabled
						/>
						<TextInput
							icon={<IconFlag size={16} />}
							placeholder={selectedProfile ? selectedProfile.nationality : "Nationality"}
							radius='xs'
							disabled
						/>
						<TextInput
							icon={<IconDeviceMobile size={16} />}
							placeholder={selectedProfile ? selectedProfile.phone : "Phone number"}
							radius='xs'
							disabled
						/>
					</Stack>
					<RichTextEditor editor={editor} styles={{ controlsGroup: { pointerEvents: selectedProfile ? 'auto' : 'none', backgroundColor: selectedProfile ? '#1A1B1E' : '#282828' } }}>
						<RichTextEditor.Toolbar sticky>
							<RichTextEditor.ControlsGroup>
								<RichTextEditor.Bold />
								<RichTextEditor.Italic />
								<RichTextEditor.Underline />
								<RichTextEditor.Strikethrough />
								<RichTextEditor.ClearFormatting />
								<RichTextEditor.Highlight />
							</RichTextEditor.ControlsGroup>

							<RichTextEditor.ControlsGroup>
								<RichTextEditor.Blockquote />
								<RichTextEditor.Hr />
								<RichTextEditor.BulletList />
								<RichTextEditor.OrderedList />
							</RichTextEditor.ControlsGroup>

							<RichTextEditor.ControlsGroup>
								<RichTextEditor.Link />
								<RichTextEditor.Unlink />
							</RichTextEditor.ControlsGroup>

							<RichTextEditor.ControlsGroup>
								<RichTextEditor.AlignLeft />
								<RichTextEditor.AlignCenter />
								<RichTextEditor.AlignJustify />
								<RichTextEditor.AlignRight />
							</RichTextEditor.ControlsGroup>

							<RichTextEditor.ControlsGroup>
								<RichTextEditor.ColorPicker
									colors={[
										"#25262b",
										"#868e96",
										"#fa5252",
										"#e64980",
										"#be4bdb",
										"#7950f2",
										"#4c6ef5",
										"#228be6",
										"#15aabf",
										"#12b886",
										"#40c057",
										"#82c91e",
										"#fab005",
										"#fd7e14",
									]}
								/>
							</RichTextEditor.ControlsGroup>
						</RichTextEditor.Toolbar>

						<ScrollArea style={{ height: 120, width: 625, padding: 0 }}>
							<RichTextEditor.Content style={{ lineHeight: 0.8, padding: 0 }} />
						</ScrollArea>
					</RichTextEditor>
				</Flex>
        <ScrollArea h={370}>
				  <Stack spacing='sm' w={430}>
            {selectedProfile && <Title color="green.7" order={6}>Last Seen: Recently</Title>}
						<MultiSelect
              disabled={selectedProfile ? false : true}
							data={tagData}
              value={tagValues}
              onChange={setTagValues}
							valueComponent={Value}
							label='Tags'
							placeholder='Select tags'
							rightSection={<IconChevronDown size='1rem' />}
							rightSectionWidth={40}
							searchable
							creatable
							maxSelectedValues={8}
							getCreateLabel={(query) => `+ Create ${query}`}
							onCreate={(query) => {
								const [value, color] = query.split(":");
								const item = {
									value: value,
									label: value,
									backgroundcolor: color ? color : "#141517",
								};
								//data.push(item);
								return item;
							}}
						/>
            <div>
              <Group spacing={5} mr={0} style={{marginBottom: 10}}>
                <Text size='md' weight={500}>
                  Licenses
                </Text>
                <Tooltip
                  label='Create new license'
                  withArrow
                  color='dark'
                  position='bottom'
                >
                  <ActionIcon style={{ width: 18, minWidth: 0, marginTop: 3 }}>
                    <IconPlus size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>

              <Group style={{ gap: 3 }}>
                <Chip defaultChecked variant='light' radius='xs' color='teal'>
                  Drivers License
                </Chip>
                <Chip defaultChecked variant='light' radius='xs' color='indigo'>
                  Firearms License
                </Chip>
                <Chip defaultChecked variant='light' radius='xs' color='indigo'>
                  Firearms License
                </Chip>
              </Group>
            </div>

            <div>
              <Text size='md' weight={500} style={{marginBottom: 10}}>
                Employment
              </Text>

              <Group style={{ gap: 3 }}>
                {selectedProfile ? 
                  selectedProfile.employment.map((job, index) => (
                    <Badge key={index} color="indigo" radius="xs" variant="dot" style={{height: '1.5rem'}}>{job.companyName} ({job.jobPosition})</Badge>
                  ))
                  :
                  <Text></Text>
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
