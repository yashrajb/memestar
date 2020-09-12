import React from "react";
import { Button, Form, FormGroup, Label, Input, Container, Row, Col } from "reactstrap";
import image from "../../assets/log-in-meme.jpg"
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
      disabledBtn:false
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.auth.isAuthenticated) {
      return {
        isAuthenticated: nextProps.auth.isAuthenticated
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.auth.isAuthenticated === true) {
      this.props.history.push("/");
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    this.setState({
      disabledBtn:true
    })
    const newUser = {
      username: this.state.username,
      password: this.state.password
    };
    this.props.login(newUser, this.props.history).then((result) => {
      this.setState({
        disabledBtn:false
      })
    });
  };

  render() {
    return (
      <div className="auth">
      <SEO title="Login - memestar"/>
        <Container>
          <Row>
            <Col>
            <img src={image} className="img-responsive" id="meme"/>
            </Col>
            <Col>
            <h1>Login</h1>
          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <Label for="username">Username</Label>
              <Input
                type="text"
                name="username"
                id="username"
                onChange={this.onChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                onChange={this.onChange}
              />
            </FormGroup>
            <Button>Submit</Button>
          </Form>
            </Col>
          </Row>
          
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
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