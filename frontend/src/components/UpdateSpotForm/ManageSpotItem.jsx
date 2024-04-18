import { NavLink } from "react-router-dom";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
// import { useModal } from "../../context/Modal";

const MangageSpotItem = ({ spot }) => {
    // const {closeModal} = useModal();

  let newAvgRating = spot.avgRating;

  if (!newAvgRating) newAvgRating = "New";

  return (
    <div id={spot.id} className="spotTile toolTip">
      <span className="toolTipText">{spot.name}</span>
      <NavLink to={`/spots/${spot.id}`}>
        <div>
          <img src={spot.previewImage} alt={spot.previewImage} />
        </div>
        <div>
          <div id="locationStars">
            <p>{`${spot.city}, ${spot.state}`}</p>
            <p>
              ⭐{Number(newAvgRating) ? newAvgRating.toFixed(1) : newAvgRating}
            </p>
          </div>
          <p>
            <span id="boldPrice">{`$${spot.price}`}</span> night
          </p>
        </div>
      </NavLink>
      <div style={{display: 'flex', justifyContent: 'space-around', width: '90%'}}>
        <NavLink to={`/spots/${spot.id}/edit`}>
          <button>Update</button>
        </NavLink>
        <div>
            <OpenModalButton
            buttonText={`Delete`}
            modalComponent={<h1>Hello</h1>}
             />
        </div>
      </div>
    </div>
  );
};

export default MangageSpotItem;
