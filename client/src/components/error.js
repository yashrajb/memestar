import React from "react";
import { Alert, Toast, ToastBody, ToastHeader } from "reactstrap";
import { connect } from "react-redux";
class Error extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render() {
    console.log(this.props.error);
    return (
      <div className="text-center">
        {typeof this.props.error === "object" && this.props.error.length &&
          this.props.error.map((err,index) => {
            return (
              <Alert key={index} color="danger" style={{ padding: "5px" }}>
                {err}
              </Alert>
            );
          })}
        {typeof this.props.error === "string" ? (
          <Alert color="danger" style={{ padding: "5px" }}>
            {this.props.error}
          </Alert>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    auth: state.auth,
    error: state.error.errors,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    clearError: () => dispatch({ type: "CLEAR_ERROR" }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Error);
