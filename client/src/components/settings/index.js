import React from "react";
import {
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import { connect } from "react-redux";
import { changePassword,deleteAccount } from "../../actions/auth";
import "../../styles/settings.css";
import SEO from "../../utils/seo";
class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      currentPassword: "",
      newPassword: "",
      error: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.DeleteAccount = this.DeleteAccount.bind(this);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.errors) {
      return {
        error: nextProps.error
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.error !== this.props.error) {
      this.setState(() => {
        return {
          error: this.props.error
        };
      });
    }
  }
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  onSubmit(e) {
    e.preventDefault();
    this.props.changepassword({
      currentPassword: this.state.currentPassword,
      newPassword: this.state.newPassword
    });
  }
  DeleteAccount(){
    this.props.deleteAcc();

  }
  render() {
    return (
      <div className="settings">
      <SEO title="Settings - memestars"/>
      <Container>
          <h3>Change Password</h3>
          <Form onSubmit={this.onSubmit}>
            <p class="text-danger">{this.state.error.changepassword || ""}</p>
            <FormGroup>
              <Label for="currentPassword">Current Password</Label>
              <Input
                type="password"
                name="currentPassword"
                id="currentPassword"
                value={this.state.currentPassword}
                onChange={this.onChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="newPassword">New Password</Label>
              <Input
                type="password"
                name="newPassword"
                id="newPassword"
                onChange={this.onChange}
                value={this.state.newPassword}
              />
            </FormGroup>
            <FormGroup>
              <Button
                color="success"
                size="md"
                disabled={
                  this.state.currentPassword && this.state.newPassword
                    ? false
                    : true
                }
              >
                Submit
              </Button>
            </FormGroup>
          </Form>

        <div className="deleteAccount">
          <h3>Delete Account</h3>
          <Button color="danger" size="md" block onClick={this.DeleteAccount}>
            Delete Account
          </Button>
        </div>
          </Container>
        </div>
      
    );
  }
}

export default connect(
  state => {
    return {
      auth: state.auth,
      error: state.error.errors
    };
  },
  dispatch => {
    return {
      changepassword: obj => dispatch(changePassword(obj)),
      deleteAcc:() => dispatch(deleteAccount())
    };
  }
)(Settings);
