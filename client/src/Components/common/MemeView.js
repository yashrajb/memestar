import React from "react";
import { LikeOrUnlikeMeme, deleteMeme } from "../../actions/meme";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {Card,Row,Col,DropdownButton,Dropdown} from "react-bootstrap";
import "../../styles/memeview.css";

class DashboardMemeView extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.like = this.like.bind(this);
  }

  like() {
    this.props.like(this.props.index, this.props._id);
  }
  deleteMeme() {
    this.props.deleteMeme(
      { _id: this.props._id, image: this.props.image },
      this.props.index
    );
  }
  header = () => {
    
    return (
    
    <>

<Card.Body>
{this.props.showProfileImage && this.props.showUsername ? (
        <>
          <Card.Img variant="top" 
            src={`${process.env.REACT_APP_IMAGE_API}${this.props.userDetails.image}`}
            className="profile-pic img-responsive"
            alt="user"
          />
          <span className="username">
            <Link to={`/profile/${this.props.userDetails.username}`}>
              {this.props.userDetails.username}
            </Link>
          </span>
        </>
      ) : null
      
  }
  {
        
    this.props.auth.isAuthenticated && `${this.props.auth.profile._id}` === `${this.props.userDetails._id}`?(
          <div style={{ float: "right" }}>
          <DropdownButton id="dropdown-basic-button" title="">
            <Dropdown.Item onClick={() => this.deleteMeme()}>
              <i className="fa fa-trash-o" aria-hidden="true"></i> Delete
            </Dropdown.Item>
          </DropdownButton>

          </div>
        ):null
        
  }
</Card.Body>
      
    </>
  );
}
  render() {
    return (
      <div id="memeview">

  <Card style={{ width: '25rem' }}>
  
  { this.props.userDetails ? this.header() : null }
  <Card.Body>
          <Card.Img variant="top" 
            src={`${process.env.REACT_APP_IMAGE_API}${this.props.image}`}
          />
  </Card.Body>
  <Card.Body>
    <Card.Text>
    <h5 className="text-center">{this.props.category}</h5>
        <p className="like-section">
          <span
            className={
              this.props.auth.isAuthenticated
                ? this.props.user_liked
                  ? `fa fa-thumbs-up`
                  : `fa fa-thumbs-o-up`
                : `fa fa-thumbs-up`
            }
            onClick={() =>
              this.props.auth.isAuthenticated ? this.like() : null
            }
          ></span>{" "}
          <span className="like_count">{`${this.props.count}`}</span>
          </p>
    </Card.Text>
  </Card.Body>
</Card>


      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps, (dispatch) => {
  return {
    like: (id, index) => {
      dispatch(LikeOrUnlikeMeme(id, index));
    },
    deleteMeme: (data, index) => {
      dispatch(deleteMeme(data, index));
    },
  };
})(DashboardMemeView);
