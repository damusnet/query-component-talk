import React, { useState } from "react";
import { ApolloProvider, Query } from "react-apollo";

import client from "../src/apollo";
import { QUERY } from "../src/queries";

const Apollo = () => {
  const [keyword, updateKeyword] = useState("");

  return (
    <ApolloProvider client={client}>
      <input
        placeholder="Enter a TV show name"
        type="text"
        value={keyword}
        onChange={({ target: { value } }) => updateKeyword(value)}
      />
      <ul>
        <Query query={QUERY} variables={{ keyword }} skip={!keyword}>
          {({
            loading,
            error,
            data: { search: { results = [] } = {} } = {}
          }) => {
            if (loading) return <li>Loading...</li>;
            if (error) return <li>{error.message}</li>;
            return results.map(({ id, name }) => <li key={id}>{name}</li>);
          }}
        </Query>
      </ul>
      <style jsx>{`
        input {
          font-size: 22px;
          width: 500px;
          padding: 14px;
        }
      `}</style>
    </ApolloProvider>
  );
};

export default Apollo;
