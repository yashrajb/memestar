import React from "react";
import {LikeOrUnlikeMeme } from "../../actions/meme"
import { connect } from "react-redux";
import {Link} from "react-router-dom";
class DashboardMemeView extends React.Component{
  constructor(props){
    super(props);
    this.props = props;
    this.like = this.like.bind(this);
  }
  like(){
    this.props.like(this.props.index,this.props._id);
  }
  render(){
  return (
    <div className="panel">
      {this.props.userDetails && this.props.userDetails.length?<p>
        <img
          src={`${process.env.REACT_APP_IMAGE_API}/profile-pic/${this.props.userDetails[0].image}`}
          className="profile-pic img-responsive"
          alt="user"
        />
        <span className="username"><Link to={`/profile/${this.props.userDetails[0].username}`}>{this.props.userDetails[0].username}</Link></span>
      </p>:null}
      <p>
        <img src={`${process.env.REACT_APP_IMAGE_API}/memes/${this.props.image}`} className="meme" alt="meme"/>
      </p>
      <h5>
          {this.props.category}
      </h5>
      <p className="like-section">
        <span className={this.props.user_liked?`fa fa-thumbs-up`:`fa fa-thumbs-o-up`} onClick={this.like}></span>{" "}
        <span className="like_count">{`${this.props.count}`}</span>
      </p>
    </div>
  );
};
}

export default connect(undefined,(dispatch) => {
  return {
    like:(id,index) => {
      dispatch(LikeOrUnlikeMeme(id,index))
    }
  }
})(DashboardMemeView);

