import React from "react";
import {LikeOrUnlikeMeme, deleteMeme } from "../../actions/meme"
import { connect } from "react-redux";
import {Link} from "react-router-dom";
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
class DashboardMemeView extends React.Component{
  constructor(props){
    super(props);
    this.props = props;
    this.like = this.like.bind(this);
    this.state = {
      dropdownopen:false
    }
  }
  toggle(){
    this.setState((prevState) => {
      return {
        dropdownopen:!prevState.dropdownopen
      }
      
    })
  }
  like(){
    this.props.like(this.props.index,this.props._id);
  }
  deleteMeme(){
    this.props.deleteMeme({_id:this.props._id,image:this.props.image},this.props.index);
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
        {this.props.auth.user.id.toString()===this.props.userDetails[0]._id.toString()?
        (<div style={{float:"right"}}>
      <ButtonDropdown isOpen={this.state.dropdownopen} toggle={() => this.toggle()}>
      <DropdownToggle caret>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => this.deleteMeme()}><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</DropdownItem>
      </DropdownMenu>
    </ButtonDropdown></div>):null}
      </p>:null}
      <p>
        <img src={`${process.env.REACT_APP_IMAGE_API}/memes/${this.props.image}`} className="meme" alt="meme"/>
      </p>
      <h5 className="text-center">
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

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps,(dispatch) => {
  return {
    like:(id,index) => {
      dispatch(LikeOrUnlikeMeme(id,index))
    },
    deleteMeme:(data,index) => {
      console.log(index);
      dispatch(deleteMeme(data,index))
    }
  }
})(DashboardMemeView);

