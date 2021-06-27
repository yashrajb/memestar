import React from "react";
import { connect } from "react-redux";
import {Navbar,Nav,NavDropdown} from "react-bootstrap";
import Container from "../common/Container";
import { Link } from "react-router-dom";
import "../../styles/header.css";
import { logout } from "../../actions/auth";
import { getMemes } from "../../actions/meme";
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
    this.props = props;
    this.onClickLogout = this.onClickLogout.bind(this);
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  onClickLogout() {
    this.props.logout();
  }
  render() {
    return (
      <div>
        
<Navbar collapseOnSelect expand="lg" className="justify-content-between">
<Container>
<Link to="/" className="navbar-brand">
              memestar
            </Link>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
    
    <Nav>
      
        <Link to="/stars" className="nav-link">
                    Stars
                  </Link>
       
      {this.props.auth.isAuthenticated ? (
      <NavDropdown title={`Hello, ${this.props.auth.profile.username}`} id="collasible-nav-dropdown">
      
          <Link to="/upload" className="dropdown-item">Upload Meme</Link>
        
      
          <Link to={`/edit`} className="dropdown-item">Profile</Link>
        
      
          <Link to={`/settings`} className="dropdown-item">Settings</Link>
        
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={this.onClickLogout}>Logout</NavDropdown.Item>
      </NavDropdown>):(

        <>
          
          <Link className="nav-link" to="/register">
                      Register
                  </Link>
          
          
            <Link className="nav-link" to="/login">Login</Link>
          
        </>

      )}
      <a href="https://yashrajb.github.io" target="_blank" className="nav-link">
          About Developer
      </a>
    </Nav>
  </Navbar.Collapse>
  </Container>
</Navbar>

      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};
const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout()),
    removeMemes: () => dispatch(getMemes([]))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
