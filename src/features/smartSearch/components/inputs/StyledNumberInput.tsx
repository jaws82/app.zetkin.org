import { TextField, TextFieldProps } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import oldTheme from 'theme';

const useStyles = makeStyles(() => ({
  MuiInput: {
    fontSize: oldTheme.typography.h4.fontSize,
    padding: 0,
    textAlign: 'center',
    width: '5rem',
  },
  MuiSelect: {
    fontSize: oldTheme.typography.h4.fontSize,
    padding: 0,
  },
  MuiTextField: {
    display: 'inline',
    verticalAlign: 'inherit',
  },
}));

const StyledNumberInput: React.FC<TextFieldProps> = (props): JSX.Element => {
  const classes = useStyles();
  return (
    <TextField
      className={classes.MuiTextField}
      type="number"
      {...props}
      inputProps={{ ...props.inputProps, className: classes.MuiInput }}
      variant="standard"
    />
  );
};

export default StyledNumberInput;
