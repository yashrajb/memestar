import React from "react";
import { Container } from "reactstrap";
import { connect } from "react-redux";
import { getProfile } from "../../actions/profile";
import "../../styles/profile.css";
import SEO from "../../utils/seo";
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      username: "",
      image: "",
      bio: ""
    };
  }
  static getDerivedStateFromProps(props, state) {
    let { username } = props.match.params;
    if (
      props.auth.isAuthenticated &&
      props.auth.profile.username === username
    ) {
      props.history.push("/edit");
    }
  }
  componentDidMount() {
    let { username } = this.props.match.params;
    this.props.profile(username).then(result => {
      this.setState({
        ...result
      });
    });
  }
  render() {
    return (
      <div class="profile">
      <SEO title={`${this.state.username} - profile - memestars`}/>
        <Container>
          <h2>profile</h2>
          <div>
            <img
              src={`${process.env.REACT_APP_IMAGE_API}/profile-pic/${this.state.image}`}
              alt="profile"
              id="profile"
            />
            <h4 id="username">username:{this.state.username}</h4>
            <p id="bio">bio:{this.state.bio}</p>
          </div>
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
    profile: name => dispatch(getProfile(name))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);
