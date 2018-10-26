import React, { Component } from "react";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import client from "../src/apollo";
import { QUERY } from "../src/queries";

const initialState = { results: [], isLoading: false, error: "" };

const ACTION_TYPES = {
  LOAD_TV_SHOWS_START: "LOAD_TV_SHOWS_START",
  LOAD_TV_SHOWS_SUCCESS: "LOAD_TV_SHOWS_SUCCESS",
  LOAD_TV_SHOWS_FAILURE: "LOAD_TV_SHOWS_FAILURE"
};

const tvShowReducer = (state = initialState, action) => {
  // Handle isLoading
  if (action.type === ACTION_TYPES.LOAD_TV_SHOWS_START) {
    return {
      ...state,
      results: [],
      isLoading: true,
      error: ""
    };
  }

  // Handle success
  if (action.type === ACTION_TYPES.LOAD_TV_SHOWS_SUCCESS) {
    return {
      ...state,
      results: action.payload.results,
      isLoading: false,
      error: ""
    };
  }

  // Handle failure
  if (action.type === ACTION_TYPES.LOAD_TV_SHOWS_FAILURE) {
    return {
      ...state,
      results: [],
      isLoading: false,
      error: action.payload.error
    };
  }

  return state;
};

if (typeof window !== "undefined") {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  window._REDUX_STORE_ = createStore(
    tvShowReducer,
    composeEnhancers(applyMiddleware(thunk))
  );
}

const ACTIONS = {
  LOAD_TV_SHOWS: async ({ keyword }) => {
    // Dispatch isLoading
    window._REDUX_STORE_.dispatch({
      type: ACTION_TYPES.LOAD_TV_SHOWS_START,
      payload: { keyword }
    });

    if (!!keyword) {
      window._REDUX_STORE_.dispatch({
        type: ACTION_TYPES.LOAD_TV_SHOWS_SUCCESS,
        payload: { keyword, results: [] }
      });
    }

    try {
      // Fetch the data
      const response = await client.query({
        query: QUERY,
        variables: { keyword }
      });

      const { data: { search: { results = [] } = {} } = {} } = response;

      // Dispatch success
      window._REDUX_STORE_.dispatch({
        type: ACTION_TYPES.LOAD_TV_SHOWS_SUCCESS,
        payload: { keyword, results }
      });
    } catch (error) {
      // Dispatch failure
      window._REDUX_STORE_.dispatch({
        type: ACTION_TYPES.LOAD_TV_SHOWS_FAILURE,
        payload: { keyword, error: error.message }
      });
    }
  }
};

let unsubscribe = null;

class Redux extends Component {
  state = { keyword: "", isLoading: false, results: [], error: "" };

  componentDidMount() {
    unsubscribe = window._REDUX_STORE_.subscribe(() => {
      const state = window._REDUX_STORE_.getState();
      console.log(state);
      this.setState({ ...state });
    });
  }

  componentWillUnmount() {
    if (unsubscribe) unsubscribe();
  }

  onChange = ({ target: { value: keyword } }) => {
    this.setState({ keyword });
    ACTIONS.LOAD_TV_SHOWS({ keyword });
  };

  render() {
    const { keyword, isLoading, error, results } = this.state;

    return (
      <div>
        <input
          placeholder="Enter a TV show name"
          type="text"
          value={keyword}
          onChange={this.onChange}
        />
        <ul>
          {!!isLoading && <li>Loading...</li>}
          {!!error && <li>{error}</li>}
          {results.map(({ id, name }) => (
            <li key={id}>{name}</li>
          ))}
        </ul>
        <style jsx>{`
          input {
            font-size: 22px;
            width: 600px;
            padding: 14px;
          }
        `}</style>
      </div>
    );
  }
}

export default Redux;
