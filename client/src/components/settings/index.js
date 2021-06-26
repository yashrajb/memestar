import React from "react";
import {
  Button,
  Form, Row, Col
} from "react-bootstrap";
import Container from "../../components/common/Container"
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

            <Form.Group className="mb-3">
              <Form.Label for="currentPassword">Current Password</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                id="currentPassword"
                value={this.state.currentPassword}
                onChange={this.onChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label for="newPassword">New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                onChange={this.onChange}
                value={this.state.newPassword}
              />
            </Form.Group>
           
           
              <Button
                variant="dark"
                className="mb-3"
                type="submit"
                disabled={
                  this.state.currentPassword && this.state.newPassword
                    ? false
                    : true
                }
              >
                Submit
              </Button>
            
              
            
          </Form>

        <Form.Group as={Row} className="deleteAccount">
          
          <h3>Delete Account</h3>
          <Button variant="danger" block size="md" onClick={this.DeleteAccount}>
            Delete Account
          </Button>
         
          
        </Form.Group>
          </Container>
        </div>
      
    );
  }
}

export default connect(
  state => {
    return {
      auth: state.auth
    };
  },
  dispatch => {
    return {
      changepassword: obj => dispatch(changePassword(obj)),
      deleteAcc:() => dispatch(deleteAccount())
    };
  }
)(Settings);
