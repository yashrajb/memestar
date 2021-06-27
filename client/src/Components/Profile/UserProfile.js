import React from "react";
import {Image,Row,Col,Button} from "react-bootstrap";
import Container from "../common/Container";
import { connect } from "react-redux";
import { getProfile } from "../../actions/profile";
import { getMeme } from "../../actions/meme";
import SEO from "../../utils/seo";
import MemeView from "../common/MemeView";
import "../../styles/profile.css";
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      username: "",
      image: "",
      bio: "",
      _id:"",
      loading:false
    };
  }
  
  async componentDidMount() {
    
    let {props} = this;
    let { username } = this.props.match.params;
    if (
      props.auth.isAuthenticated &&
      props.auth.profile.username === username
    ) {

     return props.history.push("/edit");

    }else{

      let result = await this.props.profile(username)
      await this.props.getMemes({skip:0,limit:2,user_id:result._id});
      this.setState({
            loading:false,
            ...result
      });

    }
    
    
  }

  handleFetch(){
    this.setState({
      loading:true
    },async function(){
        
      let result = await this.props.getMemes({skip:this.props.memes.length,limit:2,user_id:this.state._id})
      result && this.setState({
            loading:false
      })
        
    })
  }
  componentWillUnmount(){
    this.props.clearMemes();
  }
  render() {
    return (
      <div className="profile">
      <SEO title={`${this.state.username} - profile - memestars`}/>
        <Container>
          
          <Row>
            <Col>
              <Image
                src={`${process.env.REACT_APP_IMAGE_API}${this.state.image}`}
                thumbnail
                alt="profile"
                id="profile"
                className="img-responsive"
              />
            </Col>
            <Col>
            <p><h6><b>Username:</b> <span id="username"> {this.state.username}</span></h6></p>
            <p><h6><b>About:</b> <span id="bio"> {this.state.bio}</span></h6></p>
            </Col>
          </Row>
          {this.props.memes.map((meme,index) => {
            return <MemeView index={index} {...meme} />
          })}
          {this.props.memes.length?<p className="text-center">
            <Button style={{background:"black"}} onClick={() => this.handleFetch()}>{this.state.loading?"Loading...":"Load More"}
            </Button>
          </p>:null}
        </Container>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    auth: state.auth,
    memes: state.meme.meme
  };
};
const mapDispatchToProps = dispatch => {
  return {
    profile: (name) => dispatch(getProfile(name)),
    getMemes: (obj) => dispatch(getMeme(obj)),
    clearMemes:() => dispatch({
      type:"CLEAR_MEMES"
    })
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);
