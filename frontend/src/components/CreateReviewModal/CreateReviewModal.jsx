import "./CreateReview.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReviewThunk } from "../../store/review";
import { useModal } from "../../context/Modal";

function CreateReviewModal() {
  const spot = useSelector((state) => state.spotReducer.spot);
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [disable, setDisable] = useState(true);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const {closeModal} = useModal();

  useEffect(() => {
    setErrors({})
    if (review.length < 10 || Number(stars) < 1) setDisable(true);
    else setDisable(false);
  }, [review, stars]);

  const submitReview = async (e) => {
    e.preventDefault();
    const newReview = {
      review,
      stars,
    };

    await dispatch(createReviewThunk(spot.id, newReview)).then(() => {closeModal(); window.location.reload()}).catch(res => {
        const data = res.json();
        if(data && data.errors){
            setErrors(data.errors);
        }
    });
  };

  return (
    <form id="createReviewForm">
      <div>
        <h1>How was your stay?</h1>
        {errors.review && <div id="error"><p>{errors.review}</p></div>}
        {errors.stars && <div id="error"><p>{errors.stars}</p></div>}
      </div>
      <div>
        <textarea
          cols={50}
          rows={10}
          placeholder="Leave your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
      </div>
      <div id="starDiv">
        <div className="rate">
          <input
            type="radio"
            id="star5"
            name="rate"
            value="5"
            onChange={(e) => setStars(Number(e.target.value))}
          />
          <label htmlFor="star5" title="text"></label>
          <input
            type="radio"
            id="star4"
            name="rate"
            value="4"
            onChange={(e) => setStars(e.target.value)}
          />
          <label htmlFor="star4" title="text"></label>
          <input
            type="radio"
            id="star3"
            name="rate"
            value="3"
            onChange={(e) => setStars(e.target.value)}
          />
          <label htmlFor="star3" title="text"></label>
          <input
            type="radio"
            id="star2"
            name="rate"
            value="2"
            onChange={(e) => setStars(e.target.value)}
          />
          <label htmlFor="star2" title="text"></label>
          <input
            type="radio"
            id="star1"
            name="rate"
            value="1"
            onChange={(e) => setStars(e.target.value)}
          />
          <label htmlFor="star1" title="text"></label>
        </div>
        <b>Stars</b>
      </div>
      <div>
        <button type="submit" onClick={submitReview} disabled={disable}>
          Submit Your Review
        </button>
      </div>
    </form>
  );
}

export default CreateReviewModal;
