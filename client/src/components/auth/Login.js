import React from "react";
import { Button, Form, FormGroup, Label, Input, Container } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { login } from "../../actions/auth";
import SEO from "../../utils/seo";
import "../../styles/auth.css";
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      username: "",
      password: "",
      disabledBtn:false,
      error: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.auth.isAuthenticated) {
      return {
        isAuthenticated: nextProps.auth.isAuthenticated
      };
    }

    if (nextProps.errors) {
      return {
        errors: nextProps.errors
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.auth.isAuthenticated === true) {
      this.props.history.push("/dashboard");
    }
    if (prevProps.errors !== this.props.errors) {
      this.setState(() => {
        return {
          error: this.props.errors
        };
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    this.setState({
      error:{},
      disabledBtn:true
    })
    const newUser = {
      username: this.state.username,
      password: this.state.password
    };
    this.props.login(newUser, this.props.history);
    setTimeout(() => {
      this.setState({
      disabledBtn:false
    })
  }, 2000)
  };

  render() {
    return (
      <div className="auth">
      <SEO title="Login - memestar"/>
        <Container>
          <h1>Login</h1>
          <Form onSubmit={this.onSubmit}>
            <p className="text-danger">{Object.entries(this.state.error).length>0 && this.state.error.user?this.state.error.user:""}</p>
            <FormGroup>
              <Label for="username">Username</Label>
              <Input
                type="text"
                name="username"
                id="username"
                onChange={this.onChange}
              />
              <p className="text-danger">
                {this.state.error.email ? this.state.error.email : null}
              </p>
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                onChange={this.onChange}
              />
              <p className="text-danger">
                {this.state.error.password ? this.state.error.password : null}
              </p>
            </FormGroup>
            <Button>Submit</Button>
          </Form>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    errors: state.error.errors
  };
};
const mapDispatchToProps = dispatch => {
  return {
    login: (form, history) => dispatch(login(form, history))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Login));