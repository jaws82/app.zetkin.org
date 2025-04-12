import { Architecture, Close, Search } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  TextField,
  useMediaQuery,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';

import oldTheme from 'theme';
import { Msg, useMessages } from 'core/i18n';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import useCampaigns from 'features/campaigns/hooks/useCampaigns';
import { ZetkinCampaign, ZetkinEvent } from 'utils/types/zetkin';
import useEventMutations from '../hooks/useEventMutations';
import messageIds from 'features/events/l10n/messageIds';

interface EventActionButtonsProps {
  event: ZetkinEvent;
  isOpen: boolean;
  close: () => void;
}

const useStyles = makeStyles(() => ({
  list: {
    listStyle: 'none',
  },
  listItem: {},
}));

const EventChangeCampaignDialog: React.FunctionComponent<
  EventActionButtonsProps
> = ({ event, isOpen, close }) => {
  const classes = useStyles();
  const messages = useMessages(messageIds);
  const router = useRouter();
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const [error, setError] = useState(false);

  const { changeEventCampaign } = useEventMutations(
    event.organization.id,
    event.id
  );

  const fullScreen = useMediaQuery(oldTheme.breakpoints.down('md'));

  const [campaignFilter, setCampaignFilter] = useState('');
  const [isLoadingCampaign, setIsLoadingCampaign] = useState(0);

  const { data: campaigns } = useCampaigns(event.organization.id);
  campaigns?.reverse();

  const filteredCampaigns = campaigns
    ?.filter((campaign) =>
      campaign.title.toLowerCase().includes(campaignFilter)
    )
    .filter((campaign) => campaign.id !== event.campaign?.id);

  const onSearchChange = (value: string) => {
    setCampaignFilter(value);
  };

  const handleMove = async (campaign: ZetkinCampaign) => {
    setIsLoadingCampaign(campaign.id);

    try {
      await changeEventCampaign(campaign.id);

      showSnackbar(
        'success',
        messages.eventChangeCampaignDialog.success({
          campaignTitle: campaign.title,
        })
      );

      router.push(
        `/organize/${campaign.organization.id}/projects/${campaign.id}/events/${event.id}`
      );

      handleClose();
    } catch (error) {
      setIsLoadingCampaign(0);
      setError(true);
    }
  };

  const handleClose = () => {
    setIsLoadingCampaign(0);
    setCampaignFilter('');
    close();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth={'sm'}
      onClose={() => {
        close();
      }}
      open={isOpen}
    >
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '85vh',
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <DialogTitle sx={{ paddingLeft: 2 }} variant="h5">
            {messages.eventChangeCampaignDialog.dialogTitle()}
          </DialogTitle>

          <IconButton onClick={handleClose}>
            <Close
              color="secondary"
              sx={{
                cursor: 'pointer',
              }}
            />
          </IconButton>
        </Box>

        <Box display="flex" flexDirection="column" rowGap={1}>
          <TextField
            fullWidth
            id="EventChangeCampaignDialog-inputField"
            InputProps={{
              startAdornment: <Search color="secondary" />,
            }}
            onChange={(ev) => onSearchChange(ev.target.value)}
            value={campaignFilter}
            variant="outlined"
          />

          {error && (
            <Alert severity="error">
              <Msg id={messageIds.eventChangeCampaignDialog.error} />
            </Alert>
          )}

          <Box
            sx={{
              overflowY: 'scroll',
            }}
          >
            <List>
              {filteredCampaigns?.map((campaign) => {
                return (
                  <ListItem
                    key={`EventChangeCampaignDialog-campaignItem-${campaign.id}`}
                    className={classes.listItem}
                  >
                    <Box
                      alignItems="center"
                      display="flex"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Box alignItems="center" display="flex" marginRight={2}>
                        <Box marginRight={2}>
                          <Architecture color="secondary" />
                        </Box>
                        {campaign.title}
                      </Box>
                      <Box alignItems="center" display="flex">
                        {!isLoadingCampaign && (
                          <Button
                            onClick={() => handleMove(campaign)}
                            variant="outlined"
                          >
                            {messages.eventChangeCampaignDialog.moveButtonLabel()}
                          </Button>
                        )}
                        {isLoadingCampaign === campaign.id && (
                          <CircularProgress color="secondary" />
                        )}
                      </Box>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EventChangeCampaignDialog;
