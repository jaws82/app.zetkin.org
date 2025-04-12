import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export type ZUILarge = 'large';
export type ZUIMedium = 'medium';
export type ZUISmall = 'small';
export type ZUISize = ZUILarge | ZUIMedium | ZUISmall;

export type ZUIOrientation = 'horizontal' | 'vertical';

export type ZUIPlacement = 'top' | 'bottom' | 'start' | 'end';

export type ZUIPrimary = 'primary';
export type ZUISecondary = 'secondary';
export type ZUITertiary = 'tertiary';
export type ZUIVariant = ZUIPrimary | ZUISecondary | ZUITertiary;

export type MUIIcon = OverridableComponent<
  SvgIconTypeMap<Record<string, unknown>, 'svg'>
>;
