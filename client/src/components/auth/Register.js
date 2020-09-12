import React from "react";
import { Button, Form, FormGroup, Label, Input, Container,Row,Col } from "reactstrap";
import image from "../../assets/register-meme.jpg"
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import {register} from "../../actions/auth";
import SEO from "../../utils/seo";
import "../../styles/auth.css";
class Register extends React.Component {
  constructor(props){
    super(props);
    this.props = props;
    this.state = {
      username:"",
      password:"",
      password2:"",
      disabledBtn:false
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/');
    }
  }


  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = e => {
    e.preventDefault();
    this.setState({
      disabledBtn:true
    })
    const newUser = {
      username: this.state.username,
      password: this.state.password,
      password2: this.state.password2
    };
    this.props.registerUser(newUser, this.props.history).then((result) => {
      this.setState({
        disabledBtn:false
      })
    })
  }


  render() {
    return (
      <div className="auth">
      <SEO title="Register -  memestar"/>
        <Container>
          <Row>
            <Col>
            <img src={image} className="img-responsive" id="meme"/>
            </Col>
            <Col>
            <h1>Register</h1>
          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <Label for="exampleName">Userame</Label>
              <Input type="text" name="username" id="username" value={this.state.name} onChange={this.onChange}/>
            </FormGroup>
            <FormGroup>
              <Label for="examplePassword">Password</Label>
              <Input type="password" name="password" value={this.state.password} id="password" onChange={this.onChange}/>
            </FormGroup>
            <FormGroup>
              <Label for="examplePassword">Retype Password</Label>
              <Input type="password" name="password2" value={this.state.password2} id="password2" onChange={this.onChange}/>
            </FormGroup>
            <Button name="submitBtn" disabled={this.state.disabledBtn}>Submit</Button>
          </Form>
            </Col>
          </Row>
          
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth:state.auth
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    registerUser:(form,history) => dispatch(register(form,history))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Register));