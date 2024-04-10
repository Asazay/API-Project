import { NavLink } from "react-router-dom";

const SpotPageItem = ({spot}) => {
    let newAvgRating = spot.avgRating;

    if(!newAvgRating) newAvgRating = 0.0;

    return (
        <div id={spot.id} className="toolTip">
            <span className="toolTipText">{spot.name}</span>
           <NavLink to={`/spots/${spot.id}`}>
           <div>
                <img width={220} height={220} src={spot.previewImage} alt={spot.previewImage}/>
            </div>
            <div>
                <div id="locationStars">
                <p>{`${spot.city}, ${spot.state}`}</p>
                <p>⭐{newAvgRating.toFixed(1)}</p>
                </div>
                <p><span id='boldPrice'>{`$${spot.price}`}</span> night</p>
            </div>
           </NavLink>
        </div>
    )
}

export default SpotPageItem;