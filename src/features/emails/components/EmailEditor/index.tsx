import dynamic from 'next/dynamic';
import { Alert, Box, FormControl, TextField, useTheme } from '@mui/material';
import EditorJS, { OutputBlockData, OutputData } from '@editorjs/editorjs';
import { FC, useEffect, useRef, useState } from 'react';

import editorjsBlocksToZetkinBlocks from 'features/emails/utils/editorjsBlocksToZetkinBlocks';
import EmailSettings from './EmailSettings';
import messageIds from 'features/emails/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import zetkinBlocksToEditorjsBlocks from 'features/emails/utils/zetkinBlocksToEditorjsBlocks';
import { ZetkinEmail } from 'utils/types/zetkin';
import useEmailSettings from 'features/emails/hooks/useEmailSettings';
import useDebounce from 'utils/hooks/useDebounce';

const EmailEditorFrontend = dynamic(() => import('./EmailEditorFrontend'), {
  ssr: false,
});

interface EmailEditorProps {
  email: ZetkinEmail;
  onSave: (email: Partial<ZetkinEmail>) => void;
}

const EmailEditor: FC<EmailEditorProps> = ({ email, onSave }) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const apiRef = useRef<EditorJS | null>(null);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);
  const { subject, emailAddress, setSubject, orgTitle } = useEmailSettings(
    email.subject || ''
  );

  const zetkinInitialContent = email.content
    ? JSON.parse(email.content)
    : { blocks: [] };

  const initialContent = zetkinBlocksToEditorjsBlocks(
    zetkinInitialContent.blocks
  );

  const [content, setContent] = useState<OutputData>({
    blocks: initialContent,
  });

  const blocksRef = useRef<OutputBlockData[]>();

  const now = new Date();
  const readOnly =
    !!email.published || (!!email.published && new Date(email.published) > now);

  useEffect(() => {
    if (
      blocksRef.current !== undefined &&
      blocksRef.current.length < content.blocks.length
    ) {
      for (let i = 0; i < blocksRef.current.length; i++) {
        const block = blocksRef.current[i];
        if (block.id != content.blocks[i].id) {
          setSelectedBlockIndex(i);
          break;
        }
      }
    }
    blocksRef.current = content.blocks;
  }, [content.blocks.length]);

  const debouncedFinishedTyping = useDebounce(async (value: string) => {
    onSave({ subject: value });
  }, 400);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      {readOnly && (
        <Alert severity="info">
          <Msg id={messageIds.editor.readOnlyModeInfo} />
        </Alert>
      )}
      <Box display="flex" height="100%">
        <Box flex={1} sx={{ overflowY: 'auto' }}>
          <Box display="flex" gap={2} padding={2}>
            <FormControl fullWidth sx={{ flex: 2 }}>
              <TextField
                disabled
                fullWidth
                label={messages.editor.settings.tabs.settings.senderNameInputLabel()}
                size="small"
                value={orgTitle}
              />
            </FormControl>
            <FormControl fullWidth sx={{ flex: 2 }}>
              <TextField
                disabled
                fullWidth
                label={messages.editor.settings.tabs.settings.senderAddressInputLabel()}
                size="small"
                value={emailAddress}
              />
            </FormControl>
            <TextField
              disabled={readOnly}
              fullWidth
              label={messages.editor.settings.tabs.settings.subjectInputLabel()}
              onChange={(event) => {
                setSubject(event.target.value);
                debouncedFinishedTyping(event.target.value);
              }}
              size="small"
              sx={{ flex: 3 }}
              value={subject}
            />
          </Box>
          <EmailEditorFrontend
            apiRef={apiRef}
            initialContent={{ blocks: initialContent }}
            onSave={(newContent: OutputData) => {
              setContent(newContent);
              onSave({
                content: JSON.stringify({
                  blocks: editorjsBlocksToZetkinBlocks(newContent.blocks),
                }),
              });
            }}
            onSelectBlock={(selectedBlockIndex: number) => {
              setSelectedBlockIndex(selectedBlockIndex);
            }}
            readOnly={readOnly}
            theme={email.theme}
          />
        </Box>
        <Box
          sx={{
            borderLeft: `1px solid ${theme.palette.grey[300]}`,
            overflowY: 'auto',
          }}
          width="33%"
        >
          <EmailSettings
            apiRef={apiRef}
            blocks={content.blocks}
            readOnly={readOnly}
            selectedBlockIndex={selectedBlockIndex}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default EmailEditor;
