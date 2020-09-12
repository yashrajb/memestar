import React from "react";
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormText
} from "reactstrap";
import { connect } from "react-redux";
import { upload } from "../../actions/meme";
import { withRouter } from 'react-router-dom';
import "../../styles/uploadmeme.css";
import SEO from "../../utils/seo";
class uploadMeme extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.state = {
      meme: null,
      category: "offensive",
      disabledBtn:false,
      image: null,
      error: {}
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.errors) {
      return {
        errors: nextProps.errors
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.errors !== this.props.errors) {
      this.setState(() => {
        return {
          error: this.props.errors
        };
      });
    }
  }
  
  onSubmit(e) {
    e.preventDefault();
    if(e.target.meme.files.length && e.target.meme.files[0].size > 300000){
      return this.setState({
        error:{
          error:"File size is more than 300kb"
        }
      })
    }
    this.setState({
      disabledBtn:true
    });
    let data = new FormData();
    data.append("meme", this.state.meme);
    data.append("category", this.state.category);
    this.props.uploadMeme(data,this.props.history);
  }

  onChangeFile(e) {
    if (e.target.files[0]) {
      this.setState({
        meme: e.target.files[0],
        image: URL.createObjectURL(e.target.files[0])
      });
    } else {
      this.setState({ meme: null, image: null });
    }
  }

  onChangeCategory(e) {
    this.setState({ category: e.target.value.toLowerCase() });
  }

  render() {
    return (
      <div className="uploadmeme">
      <SEO title="upload meme - memestars"/>
        <Container>
          <h2>Upload</h2>
          <Form encType="multipart/form-data" onSubmit={this.onSubmit}>
            <p className="text-danger">{this.state.error.error}</p>
            <FormGroup>
              <Label for="exampleFile">Meme</Label>
              <Input
                type="file"
                name="meme"
                id="meme"
                onChange={this.onChangeFile}
              />
              {this.state.image ? (
                <img src={this.state.image} className="meme" alt="meme"/>
              ) : null}
              <FormText color="muted">
                Before upload make sure file is png,jpg,gif and size is less than or equal to 300kb
              </FormText>
            </FormGroup>
            <FormGroup>
              <Label for="exampleSelect">Select Category: </Label>
              <Input
                type="select"
                name="category"
                id="category"
                onChange={this.onChangeCategory}
              >
                <option>Offensive</option>
                <option>Dank</option>
                <option>Programming</option>
                <option>Uncategorized</option>
              </Input>
            </FormGroup>
            <Button>Submit</Button>
          </Form>
        </Container>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    uploadMeme: (meme,history) => dispatch(upload(meme,history))
  };
};
const mapStateToProps = state => {
  return {
    errors: state.error.errors
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(uploadMeme));
