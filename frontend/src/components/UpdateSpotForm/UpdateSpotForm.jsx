import { useState, useEffect } from "react";
import { createSpotThunk } from "../../store/spot";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getSpotThunk } from "../../store/spot";

import "./UpdateSpot.css";

const UpdateSpotForm = () => {
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spotReducer.spot);
  spot ? console.log(spot) : {};
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [photo1, setPhoto1] = useState('');
  const [photo2, setPhoto2] = useState('');
  const [photo3, setPhoto3] = useState('');
  const [photo4, setPhoto4] = useState('');
  const [photo5, setPhoto5] = useState('');
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {}, [errors]);

  useEffect(() => {
    async function loadSpot(){
        await dispatch(getSpotThunk(spotId));
    }

    loadSpot();

    // setPrice(spot.price)
    // setTitle(spot.name)
    // setCountry(spot.country);
    // setAddress(spot.address);
    // setCity(spot.city);
    // setState(spot.state);
    // setDescription(spot.description);
    // setLatitude(spot.latitude);
    // setLongitude(spot.longitude);
    // setPhoto1(spot.SpotImages[0].url);
    // setPhoto2(spot.SpotImages[1].url);
    // setPhoto3(spot.SpotImages[2].url);
    // setPhoto4(spot.SpotImages[3].url);
    // setPhoto1(spot.SpotImages[4].url);

  }, [dispatch, spotId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};
    const photos = [photo2, photo3, photo4, photo5];

    //endsProperly Function
    const endsProperly = (url, i = null) => {
      let ending;
      let jpegEnd;

      if (url.length) {
        ending = url.slice(-4);
        jpegEnd = url.slice(-5);
      }

      if (ending === ".jpg" || ending === ".png" || jpegEnd === ".jpeg") {
        return;
      } else {
        if (i === null)
          newErrors.photo1 = "Image URL must end in .png, .jpg, or .jpeg";
        else
          newErrors[`photo${i + 1}`] =
            "Image URL must end in .png, .jpg, or .jpeg";
      }
    };

    // Preview Image Check
    if (!photo1) {
      newErrors.photo1 = "Preview image is required";
    } else endsProperly(photo1);

    photos.forEach((photo, i) => {
      if (photo) endsProperly(photo, i + 1);
    });

    // if(!title) newErrors.name = 'Name is required';
    if (!price) newErrors.price = "Price is required";
    // setErrors(newErrors);

    const spotInfo = {
      country,
      address,
      city,
      state,
      lat: latitude,
      lng: longitude,
      description,
      name: title,
      price,
      photo1,
    };

    const images = { photo1, photo2, photo3, photo4, photo5 };

    if (!latitude) spotInfo.lat = 0;
    if (!longitude) spotInfo.lng = 0;

    return dispatch(createSpotThunk(spotInfo, newErrors, images))
      .then((spotData) => navigate(`/spots/${spotData.id}`))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors({ ...data.errors, ...newErrors });
        } else setErrors({ ...errors });
        console.log(data);
      });
  };

  return (
    <div id="createSpotPage">
      <form id="createSpotForm">
        <div>
          <h2>Update your Spot</h2>
          <h3>Where&apos;s your place located?</h3>
          <p>
            Guests will only get your exact address once they have booked a
            reservation
          </p>
        </div>
        <div id="fieldOpt">
          <label>
            Country{errors.country && <span>{errors.country}</span>}
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
          />
        </div>
        <div id="fieldOpt">
          <label>
            Street Address{errors.address && <span>{errors.address}</span>}
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
        </div>
        <div>
          <div id="fieldOpt">
            <label>City{errors.city && <span>{errors.city}</span>}</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
            />
          </div>
          <div id="fieldOpt">
            <label>State{errors.state && <span>{errors.state}</span>}</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="STATE"
            />
          </div>
          <div id="fieldOpt">
            <label>
              Latitude{errors.latitude && <span>{errors.latitdue}</span>}
            </label>
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="Latitude"
            />
          </div>
          <div id="fieldOpt">
            <label>
              Longitude{errors.longitude && <span>{errors.longitude}</span>}
            </label>
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="Longitude"
            />
          </div>
        </div>
        <div>
          <h3>Describe your place to guest</h3>
          <p>
            Mention the best features of your space, any special amentities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
          <textarea
            rows={10}
            cols={15}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please write at least 30 characters"
          />
          {errors.description && (
            <span>Description needs 30 or more characters</span>
          )}
        </div>
        <div>
          <h3>Create a title for your spot</h3>
          <p>
            Catch guests attention with a spot title that highlights what makes
            your place special.
          </p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Name of your spot"
          />
          {errors.name && <span>{errors.name}</span>}
        </div>
        <div>
          <h3>Set a base price for your spot</h3>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price per night(USD)"
          />
          {errors.price && <span>{errors.price}</span>}
        </div>
        <div>
          <h3>Liven up your spot with photos</h3>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <div>
            <input
              type="text"
              value={photo1}
              onChange={(e) => setPhoto1(e.target.value)}
              placeholder="Preview Image URL"
            />
            {errors.previewPhoto && (
              <span id="fieldOpt">{errors.previewPhoto}</span>
            )}
            {errors.photo1 && <span id="fieldOpt">{errors.photo1}</span>}
          </div>
          <div>
            <input
              type="text"
              value={photo2}
              onChange={(e) => setPhoto2(e.target.value)}
              placeholder="Image URL"
            />
            {errors.photo2 && <span id="fieldOpt">{errors.photo2}</span>}
          </div>
          <div>
            <input
              type="text"
              value={photo3}
              onChange={(e) => setPhoto3(e.target.value)}
              placeholder="Image URL"
            />
            {errors.photo3 && <span id="fieldOpt">{errors.photo3}</span>}
          </div>
          <div>
            <input
              type="text"
              value={photo4}
              onChange={(e) => setPhoto4(e.target.value)}
              placeholder="Image URL"
            />
            {errors.photo4 && <span id="fieldOpt">{errors.photo4}</span>}
          </div>
          <div>
            <input
              type="text"
              value={photo5}
              onChange={(e) => setPhoto5(e.target.value)}
              placeholder="Image URL"
            />
            {errors.photo5 && <span id="fieldOpt">{errors.photo5}</span>}
          </div>
        </div>
        <div>
          <button onClick={handleSubmit}>Create Spot</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateSpotForm;
