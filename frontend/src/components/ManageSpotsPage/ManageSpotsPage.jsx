import "./ManageSpots.css";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserSpotsThunk } from "../../store/spot";
import { selectAllSpots } from "../../store/spot";
import MangageSpotItem from "./ManageSpotItem";
import { NavLink } from "react-router-dom";

const ManageSpotsPage = () => {
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  let spots = useSelector(selectAllSpots);

  useEffect(() => {
    dispatch(getUserSpotsThunk(sessionUser.id)).catch(async (res) => {
      const data = await res.json();
      if (data) console.log(data);
    });
  }, [dispatch, sessionUser]);

  if(spots && spots.length) return (
    <div id="managePage">
      <div>
        <h2>Manage Your Spots</h2>
        <button>Create a New Spot</button>
      </div>
      <div id="userSpotsDiv">
        {spots && (
          <>
            {spots?.map((spot) => {
              return (
                <div key={`div${spot.id}`}>
                  <MangageSpotItem key={spot.id} spot={spot} />
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );

  else return (
    <div id="managePage">
    <h2>Manage Your Spots</h2>
    <NavLink to='/spots/new'>Create a New Spot</NavLink>
    </div>
  )
};

export default ManageSpotsPage;
