import React, { Component } from "react";
import { ApolloProvider, Query } from "react-apollo";

import client from "../src/apollo";
import { QUERY } from "../src/queries";

class Apollo extends Component {
  state = { keyword: "" };

  onChange = ({ target: { value: keyword } }) => {
    this.setState({ keyword });
  };

  render() {
    const { keyword } = this.state;

    return (
      <ApolloProvider client={client}>
        <input
          placeholder="Enter a TV show name"
          type="text"
          value={keyword}
          onChange={this.onChange}
        />
        <Query query={QUERY} variables={{ keyword, page: 1 }} skip={!keyword}>
          {({
            loading,
            error,
            variables,
            data: { search: { results = [] } = {} } = {},
            fetchMore
          }) => {
            if (loading) return <li>Loading...</li>;
            if (error) return <li>{error.message}</li>;
            return (
              <>
                <button
                  type="button"
                  onClick={() =>
                    fetchMore({
                      variables: { keyword, page: variables.page + 1 },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (!fetchMoreResult) return prev;
                        return {
                          ...prev,
                          search: {
                            ...prev.search,
                            results: [
                              ...prev.search.results,
                              ...fetchMoreResult.search.results
                            ]
                          }
                        };
                      }
                    })
                  }
                >
                  Fetch More
                </button>
                <ul>
                  {results.map(({ id, name }) => (
                    <li key={id}>{name}</li>
                  ))}
                </ul>
              </>
            );
          }}
        </Query>
        <style jsx>{`
          input {
            font-size: 22px;
            width: 500px;
            padding: 14px;
          }
          button {
            font-size: 22px;
            padding: 14px;
          }
        `}</style>
      </ApolloProvider>
    );
  }
}

export default Apollo;
