import React from "react";
import { Container,Row,Col,Button } from "reactstrap";
import { connect } from "react-redux";
import { getProfile } from "../../actions/profile";
import { getMeme } from "../../actions/meme";
import "../../styles/profile.css";
import SEO from "../../utils/seo";
import MemeView from "../common/MemeView";
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
  static getDerivedStateFromProps(props, state) {
    let { username } = props.match.params;
    if (
      props.auth.isAuthenticated &&
      props.auth.profile.username === username
    ) {
     return props.history.push("/edit");
    }
    return false;
  }
  componentDidMount() {
    let { username } = this.props.match.params;
    this.props.profile(username).then(result => {
        this.props.getMemes({skip:0,limit:2,user_id:result._id});
        this.setState({
          loading:false,
          ...result
        });
    });
  }

  handleFetch(){
    this.setState({
      loading:true
    },() => {
        this.props.getMemes({skip:this.props.memes.length,limit:2,user_id:this.state._id}).then((result) => {
          this.setState({
            loading:false
          })
        });
    })
  }
  componentWillUnmount(){
    this.props.clearMemes();
  }
  render() {
    return (
      <div class="profile">
      <SEO title={`${this.state.username} - profile - memestars`}/>
        <Container>
          <h4>profile</h4>
          <Row>
            <Col>
              <img
                src={`${process.env.REACT_APP_IMAGE_API}/profile-pic/${this.state.image}`}
                alt="profile"
                id="profile"
              />
            </Col>
            <Col>
            <h6 id="username"> Username: {this.state.username}</h6>
            <h6 id="bio"> About: {this.state.bio}</h6>
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
