import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div id='navBar'>
      <div id='thebnblogo'>
        <NavLink to="/"><img width={100} height={50} src='https://asazaybucket.s3.us-east-2.amazonaws.com/thebnblogo.png'/></NavLink>
      </div>
      {isLoaded && (
        <div id='menuBtn'>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </div>
  );
}

export default Navigation;