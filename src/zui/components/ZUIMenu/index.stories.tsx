import { AssignmentOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';

import ZUIButton from 'zui/components/ZUIButton';
import ZUIMenu from './index';

const meta: Meta<typeof ZUIMenu> = {
  component: ZUIMenu,
  title: 'Components/ZUIMenu',
};
export default meta;

type Story = StoryObj<typeof ZUIMenu>;

export const Basic: Story = {
  args: {
    menuItems: [
      {
        label: 'Call assignment',
        onClick: () => null,
      },
      { label: 'Survey', onClick: () => null, startIcon: AssignmentOutlined },
      { label: 'Task', onClick: () => null },
      { label: 'Journey', onClick: () => null },
      { divider: true, label: 'Event', onClick: () => null },
      { disabled: true, label: 'Email', onClick: () => null },
    ],
  },
  render: function Render(args) {
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    return (
      <>
        <ZUIButton
          label="Click to open menu"
          onClick={(ev) => setAnchorEl(anchorEl ? null : ev.currentTarget)}
          variant="primary"
        />
        <ZUIMenu
          {...args}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
        />
      </>
    );
  },
};

export const MaxHeight: Story = {
  args: {
    ...Basic.args,
    maxHeight: '50px',
  },
  render: Basic.render,
};

export const MinWidth: Story = {
  args: {
    ...Basic.args,
    width: '200px',
  },
  render: Basic.render,
};
