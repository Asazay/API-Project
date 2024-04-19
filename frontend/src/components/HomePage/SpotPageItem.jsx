import { NavLink } from "react-router-dom";

const SpotPageItem = ({spot}) => {
    let newAvgRating = spot.avgRating;

    if(!newAvgRating) newAvgRating = 'New';

    return (
        <div id={spot.id} className="spotTile toolTip">
            <span className="toolTipText">{spot.name}</span>
           <NavLink to={`/spots/${spot.id}`}>
           <div id="imgDiv">
                <img src={spot.previewImage} alt={spot.previewImage}/>
            </div>
            <div>
                <div id="locationStars">
                <p>{`${spot.city}, ${spot.state}`}</p>
                <p>⭐{Number(newAvgRating) ? newAvgRating.toFixed(1) : newAvgRating}</p>
                </div>
                <p><span id='boldPrice'>{`$${spot.price}`}</span> night</p>
            </div>
           </NavLink>
        </div>
    )
}

export default SpotPageItem;