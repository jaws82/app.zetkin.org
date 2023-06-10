import { cloneElement } from 'react';
import {
  IconProps,
  ListItemButton,
  ListItemIcon,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';

import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';

const SidebarListItem = ({
  icon,
  name,
  open,
  selected,
}: {
  icon: JSX.Element;
  name: 'people' | 'projects' | 'journeys' | 'areas';
  open: boolean;
  selected: boolean;
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);

  const sizedIcon = cloneElement<IconProps>(icon, {
    // Differentiate size of icon for open/closed states
    fontSize: open ? 'small' : 'medium',
  });

  return (
    <Tooltip
      placement="right"
      title={!open ? messages.organizeSidebar[name]() : undefined}
    >
      <ListItemButton
        disableGutters
        sx={{
          '&:hover': {
            background: theme.palette.grey[100],
            pointer: 'cursor',
          },
          backgroundColor: selected ? theme.palette.grey[200] : 'transparent',
          borderRadius: '3px',
          my: 0.5,
          py: open ? 1.25 : 1.5,
          transition: theme.transitions.create(
            ['padding-top', 'padding-bottom', 'background-color'],
            {
              duration: theme.transitions.duration.leavingScreen,
              easing: theme.transitions.easing.sharp,
            }
          ),
        }}
      >
        <ListItemIcon
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '48px',
            width: '48px',
          }}
        >
          {sizedIcon}
        </ListItemIcon>
        <Typography
          sx={{
            alignItems: 'center',
            display: open ? 'block' : 'none',
            fontWeight: selected ? 700 : 'normal',
          }}
        >
          {messages.organizeSidebar[name]()}
        </Typography>
      </ListItemButton>
    </Tooltip>
  );
};

export default SidebarListItem;
