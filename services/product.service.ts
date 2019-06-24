import { gql } from 'apollo-boost';
import { actions } from '../store';
import { shopify } from './apis.service';
import { ProductQueryVariables } from '../models';

const productFragment = gql`
  fragment product on Product {
    title
    description
    images(first: 1) {
      edges {
        node {
          altText
          transformedSrc
        }
      }
    }
    options {
      id
      name
      values
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;

export const productQuery = gql`
  ${productFragment}
  query product($handle: String!) {
    productByHandle(handle: $handle) {
      ...product
    }
  }
`;

export function get(variables: ProductQueryVariables) {
  return async dispatch => {
    try {
      dispatch(actions.product.getRequest());

      const { data } = await shopify.query({
        query: productQuery,
        variables
      });

      dispatch(actions.product.getSuccess({ data: data.productByHandle }));
    } catch (error) {
      dispatch(actions.product.getFailure({ error }));
    }
  };
}
