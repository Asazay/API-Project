import "./ManageSpots.css";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserSpotsThunk } from "../../store/spot";
import { selectAllSpots } from "../../store/spot";
import MangageSpotItem from "../UpdateSpotForm/ManageSpotItem";

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

  return (
    <>
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
    </>
  );
};

export default ManageSpotsPage;
