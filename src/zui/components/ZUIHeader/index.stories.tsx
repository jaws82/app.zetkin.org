import { Box } from '@mui/material';
import {
  Edit,
  Email,
  Event,
  HeadsetMicOutlined,
  People,
  Share,
} from '@mui/icons-material';
import { Meta, StoryObj } from '@storybook/react';

import RightSide from './index';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';

const meta: Meta<typeof RightSide> = {
  component: RightSide,
  title: 'Components/ZUIHeader',
};
export default meta;

type Story = StoryObj<typeof RightSide>;

export const PersonPageHeader: Story = {
  args: {
    avatar: {
      firstName: 'Angela',
      id: 1,
      lastName: 'Davis',
    },
    breadcrumbs: [
      {
        children: [
          {
            children: [],
            href: 'test2',
            title: 'Angela Davis',
          },
        ],
        href: 'test1',
        title: 'People',
      },
    ],
    title: 'Angela Davis',
  },
};

export const ProjectActivityHeader: Story = {
  args: {
    actionButtonLabel: 'Publication',
    belowActionButton: (
      <Box sx={{ bgcolor: 'lightcoral', padding: '0.5rem' }}>
        <ZUIText>Component with scheduling and status info here</ZUIText>
      </Box>
    ),
    belowTitle: (
      <Box sx={{ bgcolor: 'lightblue', padding: '0.5rem' }}>
        <ZUIText>Interactive component here</ZUIText>
      </Box>
    ),
    breadcrumbs: [
      {
        children: [
          {
            children: [
              {
                children: [],
                href: 'test3',
                title: 'My call assignmemnt',
              },
              {
                children: [],
                href: 'test4',
                title: 'My other call assignment',
              },
            ],
            href: 'test2',
            title: 'My project',
          },
        ],
        href: 'test1',
        title: 'Projects',
      },
    ],
    metaData: [
      {
        icon: People,
        label: '3668 targets',
      },
      {
        icon: HeadsetMicOutlined,
        label: '12 callers',
      },
    ],
    onTitleChange: () => null,
    title: 'My call assignment',
  },
};

export const FeaturePageHeader: Story = {
  args: {
    actionButtonLabel: 'Create',
    actionButtonVariant: 'primary',
    onActionButtonClick: () => null,
    title: 'Tags',
  },
};

/**
 * If you want the action button to open a menu, send in menu items instead of a component.
 * <br>
 *  Start icons are required in both action button menu items and ellipsis menu items.
 */
export const ActionButtonWithMenuAndEllipsisMenu: Story = {
  args: {
    actionButtonLabel: 'Create an activity',
    actionButtonPopoverContent: [
      { label: 'Event', onClick: () => null, startIcon: Event },
      { label: 'Email', onClick: () => null, startIcon: Email },
    ],
    ellipsisMenuItems: [
      { label: 'Rename', onClick: () => null, startIcon: Edit },
      { label: 'Share', onClick: () => null, startIcon: Share },
    ],
  },
};

/**
 * Instead of sending in menu items, you can send in a component to be displayed inside the action button popover
 */
export const ActionWithPopoverContentAndEllipsisMenu: Story = {
  args: {
    actionButtonLabel: 'Schedule',
    actionButtonPopoverContent: (onClose) => (
      <Box sx={{ display: 'flex', flexDirection: 'column', padding: '1rem' }}>
        <ZUIText paddingY={2}>
          Hello! This is just a random component with whatever content you want
        </ZUIText>
        <Box sx={{ alignSelf: 'flex-end' }}>
          <ZUIButton label="Close me" onClick={onClose} variant="primary" />
        </Box>
      </Box>
    ),
    ellipsisMenuItems: [
      { label: 'Rename', onClick: () => null, startIcon: Edit },
      { label: 'Share', onClick: () => null, startIcon: Share },
    ],
  },
};
