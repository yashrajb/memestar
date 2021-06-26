import React from "react";
import { connect } from "react-redux";
import {Row,Col,Modal,Form,Image,Button} from "react-bootstrap";
import Container from "../common/Container";
import { changeDetails, changeProfile } from "../../actions/profile";
import { getMeme } from "../../actions/meme";
import {setMessage} from "../../actions/error";
import { withRouter } from 'react-router-dom';
import SEO from "../../utils/seo";
import MemeView from "../common/MemeView";
import "../../styles/profile.css";

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
      image: ""
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
        this.props.getMemes({skip:0,user_id:this.props.auth.profile._id})
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
  async componentDidMount() {
    
    if(this.props.auth.profile){

      this.props.getMemes({user_id:this.props.auth.profile._id})
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
      return this.setState({
        changedProfile: e.target.files[0],
        image: URL.createObjectURL(e.target.files[0])
      });
    } 
      return this.setState({ meme: null, image: null });
    
  }

  componentWillUnmount(){
    this.props.clearMemes();
  }

  async onChangeTheProfile(e) {
    
   
      e.preventDefault();
      if(!e.target.updatedProfilePic.files.length){
        return this.setState({
          modal: !this.state.modal
        })
      }
      
    if(e.target.updatedProfilePic.files.length && e.target.updatedProfilePic.files[0].size > 300000){
      return this.props.setMessage({
        message:"File size is more than 300kb",
        type:"error"
      })
        
    }
    await this.props.profile(this.state.changedProfile, this.props.history);
  
      this.setState({
          changedProfile: null,
          image: "",
          modal: !this.state.modal,
          changeProfilePicBtn:false
        })
    
  }

  onChangeTheDetails(e) {
    let valuesChanged = {};
    valuesChanged.username = this.state.username;
    valuesChanged.bio = this.state.bio;
    this.setState({
      disabledBtn:true
    })
    this.props.details(valuesChanged,this.props.history);
  }

  handleFetch(){
    this.setState({
      loading:true
    },async function(){


       let result = await this.props.getMemes({skip:this.props.memes.length,user_id:this.props.auth.profile._id})
          result && this.setState({
            loading:false
          })
        

    })
  }

  handleModal(){
    return (<Modal show={true} onHide={this.toggle}>
    <Form
      encType="multipart/form-data"
      onSubmit={this.onChangeTheProfile}
    >
      <Modal.Header closeButton>
        Change Profile Picture
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Control
            type="file"
            name="updatedProfilePic"
            id="updatedProfilePic"
            onChange={this.onChangeFile}
          />
        </Form.Group>
        {this.state.image && <Image
          src={this.state.image} 
          thumbnail
          alt="new profile pic" 
          
        />}
       
        <Form.Text muted>
          Before upload make sure file is png,jpg,gif and size is less than or equal to 300kb
        </Form.Text>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" type="submit" disabled={this.state.image?false:true}>Submit</Button>{" "}
        <Button color="primary" onClick={this.toggle}>Cancel</Button>{" "}
      </Modal.Footer>
    </Form>
  </Modal>)
  }

  render() {
    return (
      <div className="profile">
      <SEO title={`${this.state.username} - profile - memestars`}/>
      {this.state.modal && this.handleModal()}
      <Container>
        <h1>Edit Profile</h1>
        <Row>
          <Col>
            {/*  */}
            
            <div id="profile">
            
            <Image
              src={`${process.env.REACT_APP_IMAGE_API}${this.props.auth.profile.image}`}
              alt="profile"
              thumbnail
              id="profile"
              className="img-responsive"
              onClick={this.toggle}
            />
            <h6>
            ☝️ To change profile image click on image 
            </h6>

            </div>
          </Col>
          
          <Col>
            
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="username"
                
                value={this.state.username}
                onChange={this.onChange}
                placeholder="Enter your username..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                name="bio"
                
                rows="6"
                value={this.state.bio}
                onChange={this.onChange}
                placeholder="Tell About Yourself..."
              />
            </Form.Group>
            
              <Button
                
                type="submit"
                
                variant="dark"
                disabled={this.state.username?false:true}
                onClick={this.onChangeTheDetails}
              >
                Submit
              </Button>
            
            
          </Col>
          
        </Row>
        
        {this.props.memes.map((meme,index) => {
            return <MemeView index={index} {...meme} key={index} />
          })}
        
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
    setMessage:(msg) => dispatch(setMessage(msg)),
    clearMemes:() => dispatch({
      type:"CLEAR_MEMES"
    }),

  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EditProfile));
