import { NavLink } from "react-router-dom";

const SpotPageItem = ({spot}) => {
    return (
        <div id={spot.id}>
           <NavLink to={`/spots/${spot.id}`}>
           <div>
                <img width={220} height={220} src={spot.previewImage} alt={spot.previewImage}/>
            </div>
            <div>
                <p>{`${spot.city}, ${spot.state}`}</p>
                <p id="boldPrice">{`$${spot.price}`}<span> night</span></p>
            </div>
           </NavLink>
        </div>
    )
}

export default SpotPageItem;