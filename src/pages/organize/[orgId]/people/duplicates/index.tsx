import { GetServerSideProps } from 'next';
import { Box, Typography } from '@mui/material';

import ConfigureModal from 'features/duplicates/components/ConfigureModal';
import messageIds from 'features/duplicates/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import PeopleLayout from 'features/views/layout/PeopleLayout';
import { scaffold } from 'utils/next';
import useDuplicates from 'features/duplicates/hooks/useDuplicates';
import { useMessages } from 'core/i18n';
import useServerSide from 'core/useServerSide';

export const getServerSideProps: GetServerSideProps = scaffold(async () => {
  return {
    props: {},
  };
});

const DuplicatesPage: PageWithLayout = () => {
  const onServer = useServerSide();
  const list = useDuplicates().data ?? [];
  const messages = useMessages(messageIds);

  if (onServer) {
    return null;
  }

  return (
    <>
      {list.length === 0 && (
        <Box m={2}>
          <Typography variant="overline">
            {messages.page.noDuplicates()}
          </Typography>
          <Typography variant="body1">
            {messages.page.noDuplicatesDescription()}
          </Typography>
        </Box>
      )}
      {list.length > 0 && (
        <>
          <Box>{list.map((person) => person.id)}</Box>
          <Box>
            {list.map((person) =>
              person.duplicatePersons.map((duplicate) => duplicate.first_name)
            )}
          </Box>
        </>
      )}
      <ConfigureModal duplicate={list[0]} onClose={() => {}} open={true} />
    </>
  );
};

DuplicatesPage.getLayout = function getLayout(page) {
  return <PeopleLayout>{page}</PeopleLayout>;
};

export default DuplicatesPage;
