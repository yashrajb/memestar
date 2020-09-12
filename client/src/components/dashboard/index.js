import React from "react";
import { connect } from "react-redux";
import {Container,Button,Input} from "reactstrap";
import { getMeme } from "../../actions/meme";
import DashboardMemeView from "../common/MemeView";
import SEO from "../../utils/seo";
import "../../styles/dashboard.css";
// import "../../styles/memeview.css";
class DashboardIndex extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.categories = ["all","offensive","dank","programming","uncategorized",]
    this.state = {
      loading:false,
      category:"all"
    }
  }
  componentDidMount() {
   this.props.getMemes({skip:0,limit:2});
  }
  handleFetch(){
    let obj = {skip:this.props.memes.length};
    if(this.state.category!=="all"){
      obj.category = this.state.category
    }
    this.setState({
      loading:true
    })
    this.props.getMemes(obj).then((result) => {
      this.setState({
        loading:false
      })
    });
  }
  onChangeFilter(value){
    if(value===this.state.category){
      return;
    }
    let obj = {skip:0};
    this.setState({
      category:value     
    });

    if(value!=="all"){
      obj.category = value
    }
    this.props.getMemes(obj,true).then((result) => {
      this.setState({
        loading:false
      })
    });
  }
  componentWillUnmount(){
    this.props.clearMemes();
  }
  render() {
    return (
      <div className="dashboard">
      <SEO title="dashboard - memestars"/>
        <Container>
          <p className="text-center">{this.categories.map((category) => {
            return <span className={`category ${this.state.category===category?"category__selected":''}`} onClick={() => this.onChangeFilter(category)}>{category} </span>
          })}</p>
          {this.props.memes.map((element, index) => {
            return <DashboardMemeView showProfileImage={true} showUsername={true} index={index} {...element} key={index} />;
          })}
          {this.props.memes.length?(<p className="text-center">
            <Button style={{background:"black",borderRadius:"0px"}} onClick={(e) => this.handleFetch(e)}>
              {this.state.loading?"Loading...":"Load More"}
            </Button>
          </p>):null}
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    memes: state.meme.meme,
    loading:state.meme.loading
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getMemes: (obj,filter) => dispatch(getMeme(obj,filter)),
    clearMemes:() => dispatch({
      type:"CLEAR_MEMES"
    })
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardIndex);
