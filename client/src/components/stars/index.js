import React from "react";
import { Link } from "react-router-dom";
import { Container, Col, Row } from "reactstrap";
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
          <Row>
            {this.state.stars.length
              ? this.state.stars.map((el, index) => {
                  return (
                    <Col key={index}>
                      <p className="text-center">
                        <img
                          src={`${process.env.REACT_APP_IMAGE_API}/profile-pic/${el.image}`}
                          className="profile-pic img-responsive"
                          alt="memestar"
                        />
                      </p>
                      <h6>
                        <Link
                          className="nav-link"
                          to={`/profile/${el.username}`}
                        >
                          {el.username}
                        </Link>
                      </h6>
                      <h5>
                        <span
                          className="fa fa-thumbs-up"
                          style={{ fontSize: "23px" }}
                          onClick={this.like}
                        ></span>{" "}
                        {el.likes}
                      </h5>
                    </Col>
                  );
                })
              : null}
          </Row>
        </Container>
      </div>
    );
  }
}

export default Stars;
