import React, { useState } from 'react';
import { ActionIcon, Box, createStyles, Image, Tooltip, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconX } from '@tabler/icons-react';
import { fetchNui } from '../../../../../utils/fetchNui';
import useReportStore from '../../../../../stores/reports/report';
import locales from '../../../../../locales';

const useStyles = createStyles(() => ({
  container: {
    position: 'relative',
  },
  image: {
    zIndex: 2,
    '&:hover': {
      cursor: 'pointer',
    },
  },
  actionIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  },
}));

const EvidenceImage: React.FC<{ evidence: { label: string; image: string } }> = ({ evidence }) => {
  const { classes } = useStyles();
  const [isHovering, setIsHovering] = useState(false);
  const { report, setEvidence } = useReportStore();

  return (
    <Tooltip label={evidence.label} withArrow color='gray'>
      <Box
        className={classes.container}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Image
          src={evidence.image}
          key={`${evidence.label}-${evidence.image}`}
          radius="sm"
          width={105}
          height={105}
          className={classes.image}
          onClick={() =>
            modals.open({
              children: <Image src={evidence.image} onClick={() => modals.closeAll()} />,
              withCloseButton: false,
              centered: true,
              padding: 0,
              size: 'unset',
              transitionProps: { transition: 'pop' },
            })
          }
        />
        {isHovering && (
          <ActionIcon
            variant="filled"
            color="red"
            radius="sm"
            size="xs"
            className={classes.actionIcon}
            onClick={() =>
              modals.openConfirmModal({
                title: <Text style={{ fontSize: 16, color: "white" }} weight={500}>{locales.remove_evidence}</Text>,
                centered: true,
                children: (
                  <Text size="sm" c="dark.2">
                    {locales.remove_evidence_confirm.format(evidence.label)}
                  </Text>
                ),
                labels: { confirm: locales.confirm, cancel: locales.cancel },
                confirmProps: { color: 'red' },
                groupProps: { spacing: 6 },
                onConfirm: async () => {
                  await fetchNui('removeReportEvidence', { id: report.id, label: evidence.label, image: evidence.image }, { data: 1 });
                  setEvidence((prev) =>
                    prev.filter(
                      (prevEvidence) => prevEvidence.image !== evidence.image && prevEvidence.label !== evidence.label
                    )
                  );
                },
              })
            }
          >
            <IconX />
          </ActionIcon>
        )}
      </Box>
    </Tooltip>
  );
};

export default EvidenceImage;