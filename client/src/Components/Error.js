import React from "react";
import { Toast  } from "react-bootstrap";
import { connect } from "react-redux";
class Error extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render() {
    
    return (
      <div className="text-center" style={{
        position: 'absolute',
        top: 70,
        right:30,
        zIndex:10000
      }}>
        
        { this.props.error.message?<Toast show={true} style={{background:this.props.error.type==="error"?"#e56e6e":"rgb(102 218 130)",color:"white"}} delay={3000} autohide>
          <Toast.Body>{this.props.error.message}</Toast.Body>
        </Toast>:null
        }
          
         
        
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    error: state.error
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    clearError: () => dispatch({ type: "CLEAR_ERROR" }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Error);

