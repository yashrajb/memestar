import React from "react";
import Container from "../common/Container";
import {Button,Form,FormText,Image,Row} from "react-bootstrap";
import { connect } from "react-redux";
import { upload } from "../../actions/meme";
import {setMessage} from "../../actions/error";
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
      image: null
    };
  }
 
  async onSubmit(e) {
    e.preventDefault();
    if(e.target.meme.files.length && e.target.meme.files[0].size > 300000){
      return this.props.setMessage({
        message:"File should be less 300kb size. please upload new image",
        type:"error"
      })
    }
    this.props.uploadMeme(this.state,this.props.history)
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
          <Form encType="multipart/form-data" onSubmit={this.onSubmit} >
            <Form.Group className="mb-3">
              
              <Form.File
                type="file"
                name="meme"
                id="meme"
                onChange={this.onChangeFile}
              />
              {this.state.image ? (
                <div><Image thumbnail src={this.state.image} className="meme" alt="meme"/></div>
              ) : null}
              <FormText muted style={{lineHeight:"20px"}}>
                Before upload make sure file is png,jpg,gif and size is less than or equal to 300kb
              </FormText>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label for="exampleSelect">Select Category: </Form.Label>
              <Form.Control as="select"
                type="select"
                name="category"
                id="category"
                onChange={this.onChangeCategory}
              >
                <option>Offensive</option>
                <option>Dank</option>
                <option>Programming</option>
                <option>Uncategorized</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Button variant="dark" type="submit" disabled={this.state.image && this.state.category?false:true}>Submit</Button>
            </Form.Group>
            
          </Form>
        </Container>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    uploadMeme: (meme,history) => dispatch(upload(meme,history)),
    setMessage: (message) => dispatch(setMessage(message))
  };
};

export default connect(
  undefined,
  mapDispatchToProps
)(withRouter(uploadMeme));
