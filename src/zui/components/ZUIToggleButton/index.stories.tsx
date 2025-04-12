import { useState } from 'react';
import {
  CalendarToday,
  CalendarViewMonth,
  CalendarViewWeek,
} from '@mui/icons-material';
import { Meta, StoryObj } from '@storybook/react';

import ZUIToggleButton from './index';

const meta: Meta<typeof ZUIToggleButton> = {
  component: ZUIToggleButton,
  title: 'Components/ZUIToggleButton',
};
export default meta;

type Story = StoryObj<typeof ZUIToggleButton>;

export const Basic: Story = {
  args: {
    options: [
      { label: 'Day', value: 'day' },
      { label: 'Week', value: 'week' },
      { label: 'Month', value: 'month' },
    ],
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.options[0].value);
    return (
      <ZUIToggleButton
        {...args}
        onChange={(newValue) => {
          if (newValue) {
            setValue(newValue);
          }
        }}
        value={value}
      />
    );
  },
};

export const WithIcons: Story = {
  args: {
    options: [
      { renderIcon: () => CalendarToday, value: 'day' },
      { renderIcon: () => CalendarViewWeek, value: 'week' },
      { renderIcon: () => CalendarViewMonth, value: 'month' },
    ],
  },
  render: Basic.render,
};
