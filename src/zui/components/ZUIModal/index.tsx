import { Box, Fade, IconButton, Modal, Paper, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';
import { Close } from '@mui/icons-material';

import ZUIButton from '../ZUIButton';
import { ZUISize } from '../types';
import ModalBackground from './ModalBackground';

type ZUIModalProps = {
  /**
   * The content of the modal.
   */
  children: ReactNode;

  /**
   * Function that runs when closing the modal.
   */
  onClose: () => void;

  /**
   * Determines whether the modal is open.
   */
  open: boolean;

  /**
   * The primary action button in the modal header.
   */
  primaryButton: {
    label: string;
    onClick: () => void;
  };

  /**
   * The secondary action button in the modal header.
   */
  secondaryButton?: {
    label: string;
    onClick: () => void;
  };

  /**
   * The size of the modal.
   * Small, medium and large are fixed width.
   * Full is fixed width and height.
   * Auto adjusts width and height to content.
   *
   * Defaults to "auto".
   */
  size?: ZUISize | 'auto' | 'full';

  /**
   * The title of the modal.
   */
  title: string;
};

const widths: Record<ZUISize | 'auto' | 'full', string> = {
  auto: 'auto',
  full: 'calc(100dvw - 2.5rem)',
  large: '60rem',
  medium: '37.5rem',
  small: '25rem',
};

const ZUIModal: FC<ZUIModalProps> = ({
  children,
  onClose,
  open,
  primaryButton,
  secondaryButton,
  size = 'auto',
  title,
}) => (
  <Modal
    disableRestoreFocus
    onClose={onClose}
    open={open}
    slots={{
      backdrop: () => (
        <Fade in={open} timeout={300}>
          <Box
            onClick={onClose}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.5)',
              height: '100%',
              width: '100%',
            }}
          >
            <ModalBackground height="100%" width="100%" />
          </Box>
        </Fade>
      ),
    }}
  >
    <Fade in={open} timeout={300}>
      <Paper
        sx={(theme) => ({
          border: `0.063rem solid ${theme.palette.dividers.main}`,
          boxShadow: theme.elevation.bottom.big.medium,
          height: size == 'full' ? 'calc(100dvh - 3.75rem)' : 'auto',
          left: '50%',
          maxWidth: 'calc(100dvw - 2.5rem)',
          minWidth: '25rem',
          position: 'absolute',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: widths[size],
        })}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 'auto',
            maxHeight: 'calc(100dvh - 3.75rem)',
            maxWidth: 'calc(100dvw - 2.5rem)',
            overflowY: 'hidden',
            padding: '1.25rem',
          }}
        >
          <Box
            sx={(theme) => ({
              alignItems: 'flex-start',
              borderBottom: `0.063rem solid ${theme.palette.dividers.lighter}`,
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: '1rem',
            })}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Typography variant="headingMd">{title}</Typography>
              <IconButton onClick={onClose} size="small">
                <Close sx={{ fontSize: '1.25rem' }} />
              </IconButton>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              overflowY: 'auto',
            }}
          >
            {children}
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end',
              paddingTop: '1.25rem',
            }}
          >
            {secondaryButton && (
              <ZUIButton
                label={secondaryButton.label}
                onClick={secondaryButton.onClick}
                variant="secondary"
              />
            )}
            <ZUIButton
              label={primaryButton.label}
              onClick={primaryButton.onClick}
              variant="primary"
            />
          </Box>
        </Box>
      </Paper>
    </Fade>
  </Modal>
);

export default ZUIModal;
