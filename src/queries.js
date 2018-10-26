import gql from "graphql-tag";

const apiKey = "e1c030c90262b41deac61b0565e22368";
const params = `api_key=${apiKey}&language=en-US`;

export const QUERY = gql`
  query Search($keyword: String!, $page: Int!) {
    search(keyword: $keyword, page: $page)
    @rest(type: "Search", path: "/search/tv?${params}&query={args.keyword}&page={args.page}") {
      results @type(name: "Result") {
        id @export(as: "id")
        name
        show @rest(path: "/tv/{exportVariables.id}?${params}", type: "Show") {
          id
          name
          poster_path
          seasons
        }
      }
    }
  }
`;
