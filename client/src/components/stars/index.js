import React from "react";
import { Link } from "react-router-dom";
import Container from "../common/Container";
import { Card,Row,Col,DropdownButton,Dropdown } from "react-bootstrap";
import { getStars } from "../../actions/meme";
import "../../styles/star.css";
import SEO from "../../utils/seo";
class Stars extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      stars: []
    };
  }
  async componentDidMount() {
    let stars = await getStars();
    this.setState({
      stars
    });
  }
  render() {
    return (
      <div id="stars">
        <SEO title="Trending memestars - memestars" />
        <Container>
          <h1>memestars</h1>
          
            {this.state.stars.length
              ? this.state.stars.map((el, index) => {
                  return (
                    <Card key={index} style={{ width: '17rem' }}>
                      <Card.Body>
                        <Card.Img variant="top"
                          src={`${process.env.REACT_APP_IMAGE_API}${el.image}`}
                          className="profile-pic img-responsive"
                          alt="memestar"
                        />
                      </Card.Body>
                      <Card.Body>
                        
                     
                      
                        <Card.Text>
                          <h5>  

                            <Link
                            className="nav-link"
                            to={`/profile/${el.username}`}
                          >
                            {el.username}
                          </Link>

                          </h5>
                         
                        
                        <h6>
                          
                          <i className="fa fa-thumbs-up" style={{ fontSize: "23px" }}></i> {el.likes}
                          
                          </h6>
                        
                        </Card.Text>{" "}
                        
                      </Card.Body>
                    </Card>
                  );
                })
              : null}
          
        </Container>
      </div>
    );
  }
}

export default Stars;
