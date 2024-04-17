import "./CreateReview.css";
import { useState, useEffect } from "react";

function CreateReviewModal() {
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [disable, setDisable] = useState(true);

  useEffect(() => {
    if (review.length < 10 || Number(stars) < 1) setDisable(true);
    else setDisable(false);
  }, [review, stars]);

  return (
    <form id="createReviewForm">
      <div>
        <h1>How was your stay?</h1>
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
        <button type="submit" disabled={disable}>
          Submit Your Review
        </button>
      </div>
    </form>
  );
}

export default CreateReviewModal;
