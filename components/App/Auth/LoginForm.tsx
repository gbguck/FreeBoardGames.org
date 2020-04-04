import React from 'react';
import AlertLayer from '../Game/AlertLayer';
import {
  Card,
  Typography,
  Button,
  TextField,
  Theme,
  FormControl,
  withStyles,
  CardHeader,
  IconButton,
} from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import CloseIcon from '@material-ui/icons/Close';
import InputAdornment from '@material-ui/core/InputAdornment';
import CardContent from '@material-ui/core/CardContent';
import { LoginService, RESULT_CODE } from './LoginService';

const styles = (theme: Theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  cardHeader: {
    padding: '0px',
    paddingTop: '16px',
  },
});

interface Props {
  closeLoginForm: () => void;
  classes: any; // FIXME
}

interface State {
  email: string;
  password: string;
  submitButtonEnabled: boolean;
  loginStatus: RESULT_CODE;
  isRegistering: boolean;
}

class LoginForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', submitButtonEnabled: false, isRegistering: false, loginStatus: null };
  }

  render() {
    const { classes } = this.props;
    const { loginStatus, isRegistering } = this.state;
    const headerText = isRegistering ? 'Register' : 'Log in';
    let usernameErrorText: string;
    switch (loginStatus) {
      case RESULT_CODE.UNKNOWN_EMAIL:
        usernameErrorText = 'Unknown email';
    }
    let passwordErrorText: string;
    switch (loginStatus) {
      case RESULT_CODE.BAD_PASSWORD:
        passwordErrorText = 'Incorrect password';
    }
    return (
      <AlertLayer>
        <Card
          style={{
            marginTop: '16px',
            whiteSpace: 'nowrap',
            width: '250px',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center',
          }}
        >
          <CardHeader
            action={
              <IconButton aria-label="settings" style={{ marginRight: '8px' }} onClick={this.props.closeLoginForm}>
                <CloseIcon />
              </IconButton>
            }
            className={classes.cardHeader}
            disableTypography
            title={
              <Typography style={{ marginLeft: '25%' }} variant="h6" component="h3" noWrap={true}>
                {headerText}
              </Typography>
            }
          />
          <CardContent>
            <FormControl className={classes.margin}>
              <div>
                <TextField
                  id="email"
                  label="Email"
                  type="email"
                  fullWidth
                  autoFocus
                  required
                  error={!!usernameErrorText}
                  helperText={usernameErrorText}
                  onChange={this._onChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div style={{ paddingTop: '24px' }}>
                <TextField
                  id="password"
                  label="Password"
                  type="password"
                  fullWidth
                  required
                  error={!!passwordErrorText}
                  helperText={passwordErrorText}
                  onChange={this._onChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              {isRegistering && (
                <div style={{ paddingTop: '24px' }}>
                  <TextField
                    id="password"
                    label="Confirm password"
                    type="password"
                    fullWidth
                    required
                    onChange={this._onChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKeyIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              )}
            </FormControl>
            {!isRegistering && (
              <div style={{ marginTop: '8px' }}>
                <Button
                  disableFocusRipple
                  disableRipple
                  style={{ textTransform: 'none' }}
                  variant="text"
                  color="primary"
                >
                  Forgot password?
                </Button>
              </div>
            )}
            {this._registerOrLoginButton()}
            <div>
              <Button
                variant="contained"
                color="primary"
                disabled={!this.state.submitButtonEnabled}
                onClick={this._submitButtonClicked}
                style={{ marginTop: '16px' }}
              >
                Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </AlertLayer>
    );
  }

  _loginButtonClicked = async () => {
    this.setState((oldState: State) => ({ ...oldState, isRegistering: false, loginStatus: null }));
  };

  _registerButtonClicked = async () => {
    this.setState((oldState: State) => ({ ...oldState, isRegistering: true, loginStatus: null }));
  };

  _submitButtonClicked = async () => {
    const { email, password } = this.state;
    this.setState((oldState: State) => ({ ...oldState, submitButtonEnabled: false }));
    const res = await LoginService.authenticate(email, password);
    this.setState((oldState: State) => ({ ...oldState, loginStatus: res.status, submitButtonEnabled: true }));
  };

  _onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    this.setState((oldState: State) => {
      const newState = { ...oldState };
      newState[id] = value;
      newState.submitButtonEnabled = this._validateFields(newState);
      return newState;
    });
  };

  _validateFields = (newState: State) => {
    const { email, password } = newState;
    if (!email || !password) return false;
    if (!this._validateEmail(email)) return false;
    return true;
  };

  _validateEmail = (email: string) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  };

  _registerOrLoginButton = () => {
    if (this.state.isRegistering) {
      return (
        <div style={{ marginTop: '8px' }}>
          <Button
            disableFocusRipple
            disableRipple
            style={{ textTransform: 'none' }}
            onClick={this._loginButtonClicked}
            variant="text"
            color="primary"
          >
            Already have an account?
          </Button>
        </div>
      );
    } else {
      return (
        <div style={{ marginTop: '8px' }}>
          <Button
            disableFocusRipple
            disableRipple
            style={{ textTransform: 'none' }}
            onClick={this._registerButtonClicked}
            variant="text"
            color="primary"
          >
            Register
          </Button>
        </div>
      );
    }
  };
}

export default withStyles(styles)(LoginForm);
