import React from "react";
import { connect } from "react-redux";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
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
        <Navbar expand="md">
          <div>
            <Link to="/" className="navbar-brand">
              memestar
            </Link>
          </div>
          <NavbarToggler onClick={this.toggle}>
            <span className="navbar-toggler-icon"></span>
            <span className="navbar-toggler-icon"></span>
            <span className="navbar-toggler-icon"></span>
          </NavbarToggler>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <Link className="nav-link" to="/stars">
                  Trending
                </Link>
              </NavItem>
              {this.props.auth.isAuthenticated ? (
                <NavItem>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                      Hello, {this.props.auth.profile.username}
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>
                        <Link to="/stars">Stars</Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link to="/dashboard">Dashboard</Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link to="/upload">Upload Meme</Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link to={`/edit`}>Profile</Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link to={`/settings`}>Settings</Link>
                      </DropdownItem>
                      <DropdownItem onClick={this.onClickLogout}>
                        Logout
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </NavItem>
              ) : null}
              <NavItem>
                {!this.props.auth.isAuthenticated ? (
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                ) : null}
              </NavItem>
              <NavItem>
                {!this.props.auth.isAuthenticated ? (
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                ) : null}
              </NavItem>
            </Nav>
          </Collapse>
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
