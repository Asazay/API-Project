import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
// import ManageSpotsPage from "../ManageSpotsPage/ManageSpotsPage";
import {NavLink, useNavigate} from 'react-router-dom';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate('/');
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div id='profileBtn'>
      <div>
        <button className='button' onClick={toggleMenu}>
        <FaUserCircle />
      </button>
      </div>
      <div className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <div>
            <li>Hello, {user.firstName}</li>
            {/* <li>{user.username}</li> */}
            <li>{user.email}</li>
            </div>
            <div>
            <NavLink to='/spots/current'><li className='button' onClick={() => closeMenu()}>Mangage Spots</li></NavLink>
            </div>
            <li>
              <button className='button' onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <div id="login-signup-div">
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileButton;
