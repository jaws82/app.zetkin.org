import { FormControlLabel, Switch, Typography } from '@mui/material';
import { FC } from 'react';

import { ZUIMedium, ZUIPlacement, ZUISmall } from '../types';

export type ZUISwitchProps = {
  checked: boolean;

  /**
   * Defaults to 'false'.
   */
  disabled?: boolean;

  label: string;

  /**
   * Placement of the label. Defaults to 'end'.
   */
  labelPlacement?: ZUIPlacement;

  onChange: (newCheckedState: boolean) => void;

  /**
   * The size of the switch.
   *
   * This does not affect the label size.
   */
  size?: ZUISmall | ZUIMedium;
};

const ZUISwitch: FC<ZUISwitchProps> = ({
  checked,
  disabled = false,
  label,
  labelPlacement = 'end',
  onChange,
  size = 'medium',
}) => (
  <FormControlLabel
    control={
      <Switch
        checked={checked}
        onChange={(event, newCheckedState) => onChange(newCheckedState)}
        size={size}
      />
    }
    disabled={disabled}
    label={
      <Typography
        sx={(theme) => ({
          color: disabled ? theme.palette.text.disabled : '',
        })}
        variant="labelXlMedium"
      >
        {label}
      </Typography>
    }
    labelPlacement={labelPlacement}
    sx={{
      '& .MuiTypography-root': {
        '-ms-user-select': 'none',
        '-webkit-user-select': 'none',
        userSelect: 'none',
      },
      marginBottom:
        labelPlacement == 'top' || labelPlacement == 'bottom' ? '0.5rem' : '',
      marginLeft: labelPlacement != 'end' ? 0 : '',
      marginRight: 0,
      marginTop:
        labelPlacement == 'top' || labelPlacement == 'bottom' ? '0.5rem' : '',
    }}
  />
);

export default ZUISwitch;
