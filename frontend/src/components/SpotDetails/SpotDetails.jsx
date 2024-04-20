import { useParams } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import { useEffect } from "react";
import { getSpotThunk } from "../../store/spot";
import "./SpotDetails.css";
import { loadReviewsThunk } from "../../store/review";
import { selectReviewsArray } from "../../store/review";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import CreateReviewModal from "../CreateReviewModal/CreateReviewModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";

const SpotDetails = () => {
  const sessionUser = useSelector((state) => state.session.user);
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spotReducer.spot);

  let reviews = useSelector(selectReviewsArray);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSpotThunk(spotId)).catch(async (res) => {
      const data = await res.json();
      console.log(data);
    });

    dispatch(loadReviewsThunk(spotId)).catch(async (res) => {
      const data = await res.json();
      console.log(data);
    });
  }, [dispatch, spotId]);

  const handleReserveClick = (e) => {
    e.preventDefault();
    alert("Feature Coming Soon...");
  };

  const loadRatingInfo = () => {
    let totalStars = 0;
    let numReviews = 0;
    let avgStarRating = 0;

    if(reviews){
      reviews.forEach(rev => {
        totalStars += Number(rev.stars);
        numReviews += 1;
      });

      avgStarRating = (totalStars / numReviews).toFixed(1);
    }

    if(totalStars && numReviews && avgStarRating){
      return {success: true, avgStarRating, numReviews}
    }

    else return {success: false}
  }

  const userCommented = () => {
    let value = false;

    reviews.forEach((review) => {
      if (review && sessionUser && review.User.id === sessionUser.id) {
        value = true;
        return;
      }
    });

    return value;
  };

  const checkLoggedInForSpotReviews = () => {
    const ratingInfo = loadRatingInfo();
    if (sessionUser && sessionUser.id !== spot.Owner.id && !reviews.length) {
      return (
        <>
          <h2>Be the first to post a review!</h2>
          {userCommented() === false && (
            <div style={{width: 'max-content', flexWrap: 'nowrap'}}>
              <OpenModalButton
                buttonText="Submit Your Review"
                modalComponent={<CreateReviewModal />}
              />
            </div>
          )}
        </>
      );
    } else
      return (
        <div id="spotReviewDiv">
          <div>
            <h2>
              <div style={{ display: "inline" }}>
                {" "}
                ⭐{ratingInfo.avgStarRating
                  ? ratingInfo.avgStarRating
                  : "New"}{" "}
              </div>
              {ratingInfo.numReviews && ratingInfo.numReviews > 0 && (
                <div style={{ display: "inline" }}>
                  • {ratingInfo.numReviews}{" "}
                  {ratingInfo.numReviews > 1 ? "reviews" : "review"}
                </div>
              )}
            </h2>
          </div>
          {sessionUser && sessionUser.id !== spot.Owner.id && ratingInfo.success && userCommented() === false && (
            <>
              <OpenModalButton
                buttonText="Submit Your Review"
                modalComponent={<CreateReviewModal />}
              />
            </>
          )}
          {reviews && reviews[0] && reviews[0].createdAt && reviews[0].User && (
            <div id="reviews">
              {reviews.map((review) => {
                const date = new Date(review.createdAt);
                const month = date.toLocaleString("default", { month: "long" });
                const year = date.getFullYear();

                return (
                  <div key={review.id} id="review">
                    <div style={{ fontWeight: "bold" }}>
                      {review.User.firstName}
                    </div>
                    <p style={{ color: "gray" }}>
                      {month} {year}
                    </p>
                    <p>{review.review}</p>
                    {sessionUser && review.User.id === sessionUser.id && (
                      <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<ConfirmDeleteModal reviewId={review.id}/>}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
  };

  // Page Content
  if (spot && Object.keys(spot).length === 17 && reviews) {
    const ratingInfo = loadRatingInfo();
    return (
      <div id={`spotDetails`}>
        <h2>{spot.name}</h2>
        <h4>{`${spot.city}, ${spot.state}, ${spot.country}`}</h4>
        <div id="spotImgs">
          <div id="mainSpotImg">
            {spot.SpotImages && <img src={spot.SpotImages[0].url} />}
          </div>
          <div id="additionalSpotImgs">
            <div className="additionalImg">
              <img
                src={
                  spot.SpotImages && spot.SpotImages[1]
                    ? spot.SpotImages[1].url
                    : "https://asazaybucket.s3.us-east-2.amazonaws.com/imgPlaceholder.jpg"
                }
              />
            </div>
            <div className="additionalImg">
              <img
                src={
                  spot.SpotImages && spot.SpotImages[2]
                    ? spot.SpotImages[2].url
                    : "https://asazaybucket.s3.us-east-2.amazonaws.com/imgPlaceholder.jpg"
                }
              />
            </div>
            <div className="additionalImg">
              <img
                src={
                  spot.SpotImages && spot.SpotImages[3]
                    ? spot.SpotImages[3].url
                    : "https://asazaybucket.s3.us-east-2.amazonaws.com/imgPlaceholder.jpg"
                }
              />
            </div>
            <div className="additionalImg">
              <img
                src={
                  spot.SpotImages && spot.SpotImages[4]
                    ? spot.SpotImages[4].url
                    : "https://asazaybucket.s3.us-east-2.amazonaws.com/imgPlaceholder.jpg"
                }
              />
            </div>
          </div>
        </div>
        <div id="infoContent">
          <div id="hostedBy">
            <h3>
              {spot.Owner.firstName && spot.Owner.lastName && (
                <>
                  Hosted by {`${spot.Owner.firstName} ${spot.Owner.lastName}`}
                </>
              )}
            </h3>
            {spot.description && <p>{spot.description}</p>}
          </div>
          <div id="reserveModule">
            <div id="price-reviews">
              <div>
                <p>
                  <span style={{ fontWeight: "bold" }}>${spot.price}</span>{" "}
                  night
                </p>
              </div>
              <div>
                <p>
                  ⭐{ratingInfo.avgStarRating ? ratingInfo.avgStarRating : "New"}
                </p>
                {ratingInfo.numReviews > 0 && (
                  <>
                    <p>•</p>
                    <p>
                      {ratingInfo.numReviews}{" "}
                      {ratingInfo.numReviews === 0 || ratingInfo.numReviews > 1
                        ? "reviews"
                        : "review"}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="reserveBtn">
              <button onClick={handleReserveClick}>Reserve</button>
            </div>
          </div>
        </div>
        {checkLoggedInForSpotReviews()}
      </div>
    );
  }
};

export default SpotDetails;
