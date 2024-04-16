import { NavLink} from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import {useNavigate} from 'react-router-dom';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const navigate = useNavigate();

  const handleClickCSB = (e) => {
    e.preventDefault();
    return navigate('/spots/new');
  }

  return (
    <div id='navBar'>
      <div id='thebnblogo'>
        <NavLink to="/"><img width={100} height={50} src='https://asazaybucket.s3.us-east-2.amazonaws.com/thebnblogo.png'/></NavLink>
      </div>
      
      {isLoaded && sessionUser && (
        <div id='createSpotBtn'>
          <button onClick={handleClickCSB}>Create a Spot</button>
        </div>
      )}

      {isLoaded && (
        <div id='menuBtn'>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </div>
  );
}

export default Navigation;