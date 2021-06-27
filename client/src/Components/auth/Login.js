import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import Container from "../common/Container";
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
            <Form.Group className="mb-3">
              <Form.Label for="username" >Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                onChange={this.onChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label for="password">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                
                onChange={this.onChange}
              />
            </Form.Group>
            <Button disabled={this.state.disabledBtn} type="submit" variant="dark">Submit</Button>
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