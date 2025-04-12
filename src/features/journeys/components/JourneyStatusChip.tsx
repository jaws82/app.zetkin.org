import { Chip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { useMessages } from 'core/i18n';
import { ZetkinJourneyInstance } from 'utils/types/zetkin';
import messageIds from '../l10n/messageIds';
import oldTheme from 'theme';

const useStyles = makeStyles(() => ({
  closedChip: {
    backgroundColor: oldTheme.palette.error.main,
    color: 'white',
    fontWeight: 'bold',
  },
  openChip: {
    backgroundColor: oldTheme.palette.success.main,
    color: 'white',
    fontWeight: 'bold',
  },
}));

interface JourneyStatusChipProps {
  instance: Pick<ZetkinJourneyInstance, 'closed'>;
}

const JourneyStatusChip: React.FC<JourneyStatusChipProps> = ({ instance }) => {
  const messages = useMessages(messageIds);
  const classes = useStyles();
  return !instance.closed ? (
    <Chip
      className={classes.openChip}
      data-testid="journey-status"
      label={messages.journeys.statusOpen()}
    />
  ) : (
    <Chip
      className={classes.closedChip}
      data-testid="journey-status"
      label={messages.journeys.statusClosed()}
    />
  );
};

export default JourneyStatusChip;
