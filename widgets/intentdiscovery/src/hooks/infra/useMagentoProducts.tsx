import type {GraphqlProduct} from "../../types/infra/magento/product.types.ts";

export type ProductsResponse = {
    products: {items: GraphqlProduct[]}
}

export function buildProductQuery(dynamicFields: string) {
    return `
      query GetIntentProducts($filter: ProductAttributeFilterInput!) {
          products(filter: $filter) {           
            items {
              id
              sku
              name    
              small_image {
                url
              }
              url_rewrites {
                url 
              }             
              ... on ConfigurableProduct {
                matched_variant_image {  
                   url              
                }   
                variants {
                  attributes {
                    code
                    value_index
                  }                 
                }
              }
              price_range {
                minimum_price {
                  final_price {
                    value
                    currency
                  }
                }
              }
              short_description {
                html
              }  
              ${dynamicFields}       
            }
          }
        }
    `;
}