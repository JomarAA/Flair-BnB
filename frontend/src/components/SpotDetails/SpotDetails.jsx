import "./SpotDetails.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpot } from "../../store/spots";
import { useParams } from "react-router-dom";
import { getSpotReviews } from "../../store/reviews";

const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.oneSpot);
  const reviews = useSelector((state) => state.reviews.spot);

  useEffect(() => {
    if (spotId) {
      dispatch(getSpot(spotId));
    }
  }, [dispatch, spotId]);

  useEffect(() => {
    dispatch(getSpotReviews(spotId));
  }, [dispatch, spotId]);

  if (!spot) {
    return null;
  }

  if (!reviews) {
    return null;
  }

  const images = spot.SpotImages.slice(1, 5);

  const reviewsArray = Object.values(reviews);

  //   console.log("%c   LOOK HERE", "color: blue; font-size: 18px", reviewsArray);

  return (
    <div className="one-spot-container">
      <h1>{spot.name}</h1>
      <div className="location">
        <h3>
          {spot.city}, {spot.state}, {spot.country}
        </h3>
      </div>
      <div className="spot-images-container">
        <img id="primary-image" src={spot.SpotImages[0].url} alt="Spot Image" />
        <div className="secondary-image-container">
          {images.map((image) => (
            <img
              key={image.id}
              className="secondary-image"
              src={image.url}
              alt={"Secondary Spot"}
            />
          ))}
        </div>
      </div>
      <div className="spot-details-container">
        <div id="spot-description">
          <h1>
            Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
          </h1>
          <p>{spot.description}</p>
        </div>
        <div id="reserve-square">
          <div id="reserve-info">
            <div id="pricing"> ${spot.price} night</div>
            <div className="rating-info">
              <div className="rating">
                <i className="fa-solid fa-star"></i>
                {parseFloat(spot.avgRating).toFixed(1)}
                <div className="num-reviews">{spot.numReviews}reviews</div>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              alert("Feature Coming Soon");
            }}
            id="reserve-button"
          >
            {" "}
            Reserve
          </button>
        </div>
      </div>
      <hr></hr>
      <div className="reviews-container">
        <div className="review-info">
          <div className="rating">
            <i className="fa-solid fa-star"></i>
            {parseFloat(spot.avgRating).toFixed(1)}
            <div className="num-reviews">{spot.numReviews} reviews</div>
          </div>
          <div className="review-list">
            {reviewsArray.map((review) => (
              <div key={review.id} className="review-item">
                <b className="review-user">{review.User.firstName} </b>
                <p className="review-date">
                  {new Date(review.createdAt).toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="review-text">{review.review}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotDetails;
