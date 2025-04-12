import { Button, CircularProgress } from '@mui/material';
import {
  CSSProperties,
  FC,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react';

import { MUIIcon, ZUISize, ZUIVariant } from '../types';

export type ZUIButtonVariant =
  | ZUIVariant
  | 'destructive'
  | 'warning'
  | 'loading';

export interface ZUIButtonProps {
  /**
   * The type of the button.
   *
   * Defaults to "button".
   */
  actionType?: 'button' | 'reset' | 'submit';

  /**
   * If the button is disabled or not.
   *
   * Defaults to "false".
   */
  disabled?: boolean;

  /**
   * If the button has an end icon.
   *
   * Pass in reference to the icon, for example: Close, not < Close / >.
   */
  endIcon?: MUIIcon;

  /**
   * If the button is full width.
   *
   * Defaults to "false".
   */
  fullWidth?: boolean;

  /**
   * The text on the button.
   */
  label: string;

  /**
   * The function that runs when the user presses the button.
   */
  onClick?: MouseEventHandler<HTMLButtonElement>;

  /**
   * The function that runs when the user presses a key on
   * the keyboard.
   */
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;

  /**
   * The size of the button.
   *
   * Defaults to "medium".
   */
  size?: ZUISize;

  /**
   * The start icon of the button.
   *
   * Pass in reference to the icon, for example: Close, not < Close / >.
   */
  startIcon?: MUIIcon;

  /**
   * The variant of the button.
   * Controls the color and outline.
   */
  variant?: ZUIButtonVariant;
}

export const getVariant = (variant: ZUIButtonVariant) => {
  if (variant === 'secondary') {
    return 'outlined';
  } else if (variant === 'tertiary') {
    return 'text';
  } else {
    return 'contained';
  }
};

const getColor = (variant: ZUIButtonVariant) => {
  if (variant === 'destructive') {
    return 'error';
  } else if (variant === 'warning') {
    return 'warning';
  } else {
    return 'primary';
  }
};

const getLoadingIndicatorPadding = (size: ZUISize = 'medium') => {
  if (size == 'large') {
    return '0.183rem 1.375rem 0.183rem 1.375rem';
  } else if (size == 'medium') {
    return '0.625rem 1rem 0.625rem 1rem';
  } else if (size == 'small') {
    return '0.438rem 0.625rem 0.438rem 0.625rem';
  }
};

const getTextPadding = (
  size: ZUISize = 'medium',
  variant: ZUIButtonVariant = 'secondary'
) => {
  if (size === 'large') {
    if (variant === 'secondary') {
      return '0.467rem 1.375rem';
    } else {
      return '0.517rem 1.375rem';
    }
  }

  if (size === 'medium') {
    if (variant == 'secondary') {
      return '0.45rem 1rem';
    } else {
      return '0.5rem 1rem';
    }
  }

  if (size === 'small') {
    if (variant === 'secondary') {
      return '0.275rem 0.625rem';
    } else {
      return '0.33rem 0.625rem';
    }
  }
};

const ZUIButton: FC<ZUIButtonProps> = ({
  actionType,
  disabled,
  endIcon: EndIcon,
  fullWidth,
  label,
  onClick,
  onKeyDown,
  size = 'medium',
  startIcon: StartIcon,
  variant,
}) => {
  const isLoading = variant === 'loading';
  return (
    <Button
      color={variant ? getColor(variant) : undefined}
      disabled={disabled || isLoading}
      endIcon={EndIcon ? <EndIcon /> : null}
      fullWidth={fullWidth}
      onClick={onClick}
      onKeyDown={onKeyDown}
      size={size}
      startIcon={StartIcon ? <StartIcon /> : null}
      sx={(theme) => {
        let textStyle: CSSProperties;
        if (size === 'small') {
          textStyle = theme.typography.labelSmSemiBold;
        } else if (size === 'medium') {
          textStyle = theme.typography.labelMdSemiBold;
        } else {
          textStyle = theme.typography.labelLgSemiBold;
        }

        return {
          '& >.MuiCircularProgress-root': {
            color: theme.palette.grey[300],
          },
          '&.Mui-disabled': {
            '&.MuiButton-containedError': {
              backgroundColor: theme.palette.swatches.red[400],
              color: theme.palette.swatches.red[100],
            },
            '&.MuiButton-containedPrimary': {
              backgroundColor: theme.palette.grey[600],
              color: theme.palette.grey[300],
            },
            '&.MuiButton-containedWarning': {
              backgroundColor: theme.palette.swatches.yellow[200],
              color: theme.palette.swatches.yellow[600],
            },
            '&.MuiButton-outlinedPrimary': {
              borderColor: theme.palette.grey[300],
              color: theme.palette.grey[400],
            },
            '&.MuiButton-textPrimary': {
              color: theme.palette.grey[400],
            },
          },
          '&:hover': {
            '&.MuiButton-containedError': {
              backgroundColor: theme.palette.error.dark,
            },
            '&.MuiButton-containedPrimary': {
              backgroundColor: theme.palette.primary.dark,
            },
            '&.MuiButton-containedWarning': {
              backgroundColor: theme.palette.warning.dark,
            },
            '&.MuiButton-outlinedPrimary': {
              backgroundColor: theme.palette.grey[100],
            },
            '&.MuiButton-textPrimary': {
              backgroundColor: theme.palette.grey[100],
            },
            boxShadow: 'none',
          },
          ...textStyle,
          boxShadow: 'none',
          minWidth: '2.188rem',
          padding: isLoading
            ? getLoadingIndicatorPadding(size)
            : getTextPadding(size, variant),
        };
      }}
      type={actionType}
      variant={variant ? getVariant(variant) : undefined}
    >
      {isLoading ? <CircularProgress size={16} /> : label}
    </Button>
  );
};

export default ZUIButton;
