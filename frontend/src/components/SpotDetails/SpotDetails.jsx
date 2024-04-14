import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getSpotThunk } from "../../store/spot";
import "./SpotDetails.css";
import { loadReviewsThunk } from "../../store/review";
import { selectReviewsArray } from "../../store/review";

const SpotDetails = () => {
  const sessionUser = useSelector(state => state.session.user)
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spotData.spot);
  let reviews = useSelector(selectReviewsArray);
  if(reviews.Reviews){
    reviews = reviews.Reviews.sort(review => {
      return new Date(review.createAt).getMilliseconds() - new Date(review.createdAt).getMilliseconds();
    });
  }

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
    alert("Feature Coming Soon...")
  }

  const checkLoggedInForSpotReviews = () => {
    if(sessionUser && sessionUser.id !== spot.Owner.id && !reviews.length){
      return (<h2>Be the first to post a review!</h2>)
    }
    else return (<div id="spotReviewDiv">
    <div>
      <h2>
        <div style={{ display: "inline" }}>
          {" "}
          ⭐{spot.avgStarRating
            ? spot.avgStarRating.toFixed(1)
            : "New"}{" "}
        </div>
        {spot.numReviews > 0 && 
        <div style={{ display: "inline" }}>
          • {" "} {spot.numReviews}  {spot.numReviews > 1 ? "reviews" : "review"}
        </div>}
      </h2>
    </div>
    <div id="reviews">
      {reviews.map((review) => {
        const date = new Date(review.createdAt);
        const month = date.toLocaleString("default", { month: "long" });
        const year = date.getFullYear();

        return (
          <div key={review.id} id="review">
            <div style={{fontWeight: 'bold'}}>{review.User.firstName}</div>
            <p style={{ color: "gray" }}>
              {month} {year}
            </p>
            <p>{review.review}</p>
          </div>
        );
      })}
    </div>
  </div>)
  }

  // Page Content
  if (spot && reviews) {
    return (
      <div id={`spotDetails`}>
        <h2>{spot.name}</h2>
        <h4>{`${spot.city}, ${spot.state}, ${spot.country}`}</h4>
        <div id="spotImgs">
          <div id="mainSpotImg">
            {spot.SpotImages &&<img src={spot.SpotImages[0].url} />}
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
              Hosted by {`${spot.Owner.firstName} ${spot.Owner.lastName}`}
            </h3>
            <p>{spot.description}</p>
          </div>
          <div id="reserveModule">
            <div id="price-reviews">
              <div>
                <p>
                  <span style={{ fontWeight: "bold"}}>${spot.price}</span>{" "}
                  night
                </p>
              </div>
              <div>
                <p>
                  ⭐{spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "New"}
                </p>
                {spot.numReviews > 0 && <><p>•</p>
                <p>
                  {spot.numReviews} {
                (spot.numReviews === 0 || spot.numReviews > 1) ? 'reviews' : 'review'
                  }
                </p></>}
              </div>
            </div>
            <div id="reserveBtn">
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
