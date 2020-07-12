import React from "react";
import { Button, Form, FormGroup, Label, Input, Container } from "reactstrap";
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
      disabledBtn:false,
      error:{}
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
      if(nextProps.errors){
        return {
          errors:nextProps.errors
        }
      }
      return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.errors!==this.props.errors){
      this.setState(() => {
        return {
          error:this.props.errors
        }
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = e => {
    e.preventDefault();
    this.setState({
      disabledBtn:true,
      error:{}
    })
    const newUser = {
      username: this.state.username,
      password: this.state.password,
      password2: this.state.password2
    };
    this.props.registerUser(newUser, this.props.history);
    setTimeout(() => {
      this.setState({
      disabledBtn:false
    })
  }, 1000)
  }


  render() {
    return (
      <div className="auth">
      <SEO title="Register -  memestar"/>
        <Container>
          <h1>Register</h1>
          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <Label for="exampleName">Userame</Label>
              <Input type="text" name="username" id="username" value={this.state.name} onChange={this.onChange}/>
              <p class="text-danger">{this.state.error.user?this.state.error.user:null}</p>
            </FormGroup>
            <FormGroup>
              <Label for="examplePassword">Password</Label>
              <Input type="password" name="password" value={this.state.password} id="password" onChange={this.onChange}/>
              <p class="text-danger">{this.state.error.password?this.state.error.password:null}</p>
            </FormGroup>
            <FormGroup>
              <Label for="examplePassword">Retype Password</Label>
              <Input type="password" name="password2" value={this.state.password2} id="password2" onChange={this.onChange}/>
              <p class="text-danger">{this.state.error.password2?this.state.error.password2:null}</p>
            </FormGroup>
            <Button name="submitBtn" disabled={this.state.disabledBtn}>Submit</Button>
          </Form>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth:state.auth,
    errors:state.error.errors
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    registerUser:(form,history) => dispatch(register(form,history))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Register));