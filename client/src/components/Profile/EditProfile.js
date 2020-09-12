import React from "react";
import { connect } from "react-redux";
import {
  Input,
  FormGroup,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormText,
  Form,
  Container,
  Row,
  Col
} from "reactstrap";
import { changeDetails, changeProfile } from "../../actions/profile";
import { getMeme } from "../../actions/meme";
import { withRouter } from 'react-router-dom';
import "../../styles/profile.css";
import SEO from "../../utils/seo";
import MemeView from "../common/MemeView";
class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      bio: "",
      modal: false,
      changedProfile: null,
      disabledBtn:false,
      changeProfilePicBtn:false,
      image: "",
      error: {}
    };
    this.props = props;
    this.onChange = this.onChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.onChangeTheProfile = this.onChangeTheProfile.bind(this);
    this.onChangeTheDetails = this.onChangeTheDetails.bind(this);
  }
    componentDidUpdate(prevProps,prevState){
      if(!prevProps.auth.profile.username && this.props.auth.profile.username){
        this.props.getMemes({skip:0,user_id:this.props.auth.user.id})
        this.setState({
          username:this.props.auth.profile.username
        })
      }

      if(!prevProps.auth.profile.bio && this.props.auth.profile.bio){
        this.setState({
          bio:this.props.auth.profile.bio        
        })
      }
    }
  componentDidMount() {
    if(Object.entries(this.props.auth.profile).length){

      this.setState({
        username:this.props.auth.profile.username,
        bio:this.props.auth.profile.bio
      });
    }
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  toggle() {
    this.setState(state => {
      return {
        modal: !state.modal,
        image: "",
        changedProfile: null
      };
    });
  }

  onChangeFile(e) {
    if (e.target.files[0]) {
      this.setState({
        changedProfile: e.target.files[0],
        image: URL.createObjectURL(e.target.files[0])
      });
    } else {
      this.setState({ meme: null, image: null });
    }
  }

  componentWillUnmount(){
    this.props.clearMemes();
  }

  onChangeTheProfile(e) {
    e.preventDefault();
    if(!e.target.updatedProfilePic.files.length){
      return this.setState(state => {
       return {
        modal: !state.modal
      }
    })
    }
    if(e.target.updatedProfilePic.files.length && e.target.updatedProfilePic.files[0].size > 300000){
      return this.setState({
        error:{
          profileError:"File size is more than 300kb"
        }
      })
    }
    this.setState({
      changeProfilePicBtn:true
    })
    let data = new FormData();
    data.append("profilePic", this.state.changedProfile);
    this.props.profile(data, this.props.history);
    setTimeout(() => {
      this.setState(state => {
        return {
          changedProfile: null,
          image: "",
          modal: !state.modal,
          changeProfilePicBtn:false
        };
      })
    },1000);
  }

  onChangeTheDetails(e) {
    if(!this.state.username){
      return this.setState({
        error:{
          error:"username is not optional."
        }
      });
    }
    let valuesChanged = {};
    valuesChanged.username = this.state.username;
    valuesChanged.bio = this.state.bio;
    this.setState({
      disabledBtn:true
    })
    this.props.details(valuesChanged,this.props.history);
    this.setState({
      error:{},
      disabledBtn:false
    })
  }

  handleFetch(){
    this.setState({
      loading:true
    },() => {
        this.props.getMemes({skip:this.props.memes.length,user_id:this.props.auth.user.id}).then((result) => {
          this.setState({
            loading:false
          })
        });
    })
  }

  render() {
    return (
      <div class="profile">
      <SEO title={`${this.state.username} - profile - memestars`}/>
      <Container>
        {/* <h1>Edit Profile</h1> */}
        {this.state.error.error?<p className="text-danger">{this.state.error.error}</p>:null}
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <Form
            encType="multipart/form-data"
            onSubmit={this.onChangeTheProfile}
          >
            <ModalHeader toggle={this.toggle}>
              Change Profile Picture
            </ModalHeader>
            <ModalBody>
              <p> {this.state.error.profileError?<p className="text-danger">{this.state.error.profileError}</p>:null}</p>
              <Input
                type="file"
                name="updatedProfilePic"
                id="updatedProfilePic"
                onChange={this.onChangeFile}
              />
              {this.state.image ? (
                <img src={this.state.image} className="renderChangedPic" alt="new profile pic"/>
              ) : null}
              <FormText color="muted">
                Before upload make sure file is png,jpg,gif and size is less than or equal to 300kb
              </FormText>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" disabled={this.state.changeProfilePicBtn}>Submit</Button>{" "}
            </ModalFooter>
          </Form>
        </Modal>
        <Row>
          <Col>
            {/*  */}
            
            <div id="profile">
            <img
              src={`${process.env.REACT_APP_IMAGE_API}/profile-pic/${this.props.auth.profile.image}`}
              alt="profile"
              id="profile"
              onClick={this.toggle}
            />
            <Button
                color="secondary"
                size="sm"
                id="change-profile"
                onClick={this.toggle}
              >
                Change Profile
              </Button>
            </div>
            
              {/* <Button
                color="secondary"
                
                onClick={this.toggle}
              >
                Change Profile
              </Button> */}
            
            </Col>
                <Col>
            <FormGroup>
              <Input
                type="text"
                name="username"
                id="editusername"
                value={this.state.username}
                onChange={this.onChange}
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="textarea"
                name="bio"
                id="editbio"
                rows="3"
                value={this.state.bio}
                onChange={this.onChange}
              />
            </FormGroup>
            <FormGroup>
              <Button
                color="success"
                id="btn-submit"
                type="submit"
                size="sm"
                disabled={this.state.disabledBtn}
                onClick={this.onChangeTheDetails}
              >
                Submit
              </Button>
            </FormGroup>
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
    profile: name => dispatch(changeProfile(name)),
    details: (detail,history) => dispatch(changeDetails(detail,history)),
    getMemes: (obj) => dispatch(getMeme(obj)),
    clearMemes:() => dispatch({
      type:"CLEAR_MEMES"
    }),

  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EditProfile));
