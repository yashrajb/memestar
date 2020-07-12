import React from "react";
import { connect } from "react-redux";
import {Link} from "react-router-dom";
import image from "../assets/pepe-image.png";
import {Row,Col,Container} from "reactstrap";
import SEO from "../utils/seo";
import "../styles/main.css";
class Main extends React.Component {
  constructor(props){
    super(props);
    this.props = props;
  }
  componentDidMount(){
    if(this.props.auth.isAuthenticated){
      this.props.history.push("/dashboard");
    }
  }
  render() {
    return (
        <div className="main">
        <SEO />
        <Container>
        <Row>
        <Col>
          <img src={image} className="img-responsive pepe-image"/>  
        </Col>
        <Col>
          <h1>memes are form of art</h1>
          <Link className="btn btn-default" to="/register">Register</Link>
          <Link className="btn btn-default" to="/login">Login</Link>
        </Col>
        </Row>
        </Container>
        <p className="text-center about-dev">Developed by - <a target="_blank" href="http://yashrajbasan.com">yashraj basan</a></p>
      </div>
    );
  }
}

export default connect(state => {
  return {
    auth: state.auth
  };
})(Main);
