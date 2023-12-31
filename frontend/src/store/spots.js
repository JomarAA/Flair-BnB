import { csrfFetch } from "./csrf";

//const to avoid debugging typos
const GET_SPOTS = "spots/GET_SPOTS";
const GET_SPOT_DETAILS = '/spots/GET_SPOT_DETAILS';
const CREATE_SPOT = '/spots/CREATE_SPOT';
const UPDATE_SPOT = 'spots/UPDATE_SPOT'
const DELETE_SPOT = 'spots/DELETE_SPOT'
const GET_USER_SPOTS = '/spots/GET_USER_SPOTS'

const createSpot = (payload) => {
  return {
    type: CREATE_SPOT,
    payload
  }
}

const getUserSpots = (spots) => {
  return {
    type: GET_USER_SPOTS,
    spots,
  };
};


const getSpots = (spots) => {
  return {
    type: GET_SPOTS,
    spots,
  };
};

const getSpotDetails = (spot) => {
    return {
        type: GET_SPOT_DETAILS,
        spot
    }
}

const updateSpot = (spot) => {
  return {
    type: UPDATE_SPOT,
    spot
  }
}

const deleteSpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    spotId
  }
}


// thunk action creator

export const deleteSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method:"DELETE",
  })
  if (res.ok) {
    dispatch(deleteSpot(spotId))
  }
}

export const getSpot = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`)
  // console.log("%c   LOOK HERE", "color: blue; font-size: 18px", res);

  if (res.ok) {
    const spotDetails = await res.json();
    dispatch(getSpotDetails(spotDetails))
    return spotDetails;
  }
  return res
}


export const createNewSpot = (payload, img) => async (dispatch) => {
  try {
  const res = await csrfFetch(`/api/spots`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  })
  if (res.ok) {
    const spot = await res.json();
    for (let i = 0; i < img.length; i++) {
      if (img[i]) {
      await csrfFetch(`/api/spots/${spot.id}/images`, {
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: img[i],
          preview: true,
        }),
      })
    }
    }
    dispatch(createSpot(spot));
    return spot;
  }else {
    const error = await res.json();
    console.error("Error in createNewSpot:", error);
    return error;
  }
}
  catch (error) {
    // console.log("%c   LOOK HERE", "color: blue; font-size: 18px", error);
    return error;
  }

};

export const allSpotsThunktion = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  // console.log("%c   LOOK HERE", "color: blue; font-size: 18px", res)
  if (res.ok) {
    let spots  = await res.json();
    spots = spots.Spots
    // console.log('SPOTS:   ',spots)
    dispatch(getSpots(spots));
    return spots;
  }
  return res
};

export const getCurrentUserSpots = () => async (dispatch) => {
  const res = await csrfFetch('/api/spots/current')

    if (res.ok) {
      let spots = await res.json();
      spots = spots.Spots
    dispatch(getUserSpots(spots));
    return spots;
  }
  return res;
};


export const editSpot = (spot, spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(spot)
  })
  // console.log("%c   LOOK HERE", "color: red; font-size: 18px", spot)
  if (res.ok) {
    const updatedSpot = await res.json();
    dispatch(updateSpot(updatedSpot, spotId));
    return updatedSpot
  }
  return res
}

const initialState = {
  allSpots: {},
  oneSpot: null,
  currentUserSpots:{}
};

//reducer
let updatedAllSpots
let nextState

const spotsReducer = (state = initialState, action) => {
  // console.log("%c   LOOK HERE", "color: blue; font-size: 18px", action);
  switch (action.type) {
    case GET_SPOTS:
      return { ...state, allSpots: action.spots };
    case GET_SPOT_DETAILS:
      return { ...state, oneSpot: { ...action.spot } };
      case CREATE_SPOT:
         updatedAllSpots = { ...state.allSpots };
        updatedAllSpots[action.payload.id] = action.spot;
        return { ...state,allSpots:{...updatedAllSpots}};
    case UPDATE_SPOT:
      return {...state, oneSpot:{...state.oneSpot, ...action.spot}}
    case DELETE_SPOT:
       nextState= {...state,...state.allSpots}
      delete nextState.allSpots[action.spotId];
      return nextState
      case GET_USER_SPOTS:
      return { ...state, currentUserSpots: action.spots };
    default:
      return state;
  }
};

export default spotsReducer;
