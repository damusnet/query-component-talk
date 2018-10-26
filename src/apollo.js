import "isomorphic-fetch";

import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { RestLink } from "apollo-link-rest";

const apiBase = "https://api.themoviedb.org/3";

const restLink = new RestLink({
  uri: apiBase,
  credentials: "same-origin",
  headers: { Accept: "application/json" }
});

const client = new ApolloClient({
  connectToDevTools: true,
  link: restLink,
  cache: new InMemoryCache()
});

export default client;
