/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getBook = /* GraphQL */ `
  query GetBook($id: ID!) {
    getBook(id: $id) {
      id
      title
      tableOfContents
      imagePath
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listBooks = /* GraphQL */ `
  query ListBooks(
    $filter: ModelBookFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBooks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        tableOfContents
        imagePath
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPage = /* GraphQL */ `
  query GetPage($id: ID!) {
    getPage(id: $id) {
      id
      bookId
      bookTitle
      pageId
      recipeStory
      ingredients {
        name
        quantity
        unit
        __typename
      }
      steps
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listPages = /* GraphQL */ `
  query ListPages(
    $filter: ModelPageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        bookId
        bookTitle
        pageId
        recipeStory
        steps
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const pagesByBookIdAndBookTitle = /* GraphQL */ `
  query PagesByBookIdAndBookTitle(
    $bookId: ID!
    $bookTitle: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    pagesByBookIdAndBookTitle(
      bookId: $bookId
      bookTitle: $bookTitle
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        bookId
        bookTitle
        pageId
        recipeStory
        steps
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
