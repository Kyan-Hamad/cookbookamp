/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateBook = /* GraphQL */ `
  subscription OnCreateBook($filter: ModelSubscriptionBookFilterInput) {
    onCreateBook(filter: $filter) {
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
export const onUpdateBook = /* GraphQL */ `
  subscription OnUpdateBook($filter: ModelSubscriptionBookFilterInput) {
    onUpdateBook(filter: $filter) {
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
export const onDeleteBook = /* GraphQL */ `
  subscription OnDeleteBook($filter: ModelSubscriptionBookFilterInput) {
    onDeleteBook(filter: $filter) {
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
export const onCreatePage = /* GraphQL */ `
  subscription OnCreatePage($filter: ModelSubscriptionPageFilterInput) {
    onCreatePage(filter: $filter) {
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
export const onUpdatePage = /* GraphQL */ `
  subscription OnUpdatePage($filter: ModelSubscriptionPageFilterInput) {
    onUpdatePage(filter: $filter) {
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
export const onDeletePage = /* GraphQL */ `
  subscription OnDeletePage($filter: ModelSubscriptionPageFilterInput) {
    onDeletePage(filter: $filter) {
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
