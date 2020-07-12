import React from "react";
import { connect } from "react-redux";
import {Container} from "reactstrap";
import { getMeme } from "../../actions/meme";
import DashboardMemeView from "./MemeView";
import SEO from "../../utils/seo";
import "../../styles/dashboard.css";
class DashboardIndex extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  componentDidMount() {
    this.props.getMemes();
  }
  render() {
    return (
      <div className="dashboard">
      <SEO title="dashboard - memestars"/>
        <Container>
          {this.props.loading===false?this.props.memes.map((element, index) => {
            return <DashboardMemeView index={index} {...element} key={index} />;
          }):<p>loading</p>}
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
    getMemes: () => dispatch(getMeme())
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardIndex);
