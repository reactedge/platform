import type {GalleryTile} from "../../components/Types.ts";
import type {GraphqlClient} from "../graphql/graphqlClient.ts";

export type MagentoProduct = {
    sku: string
    image: {
        url: string
    }
    media_gallery: [
        {
            url: string
            label: string
        }
    ]
}

export type GraphqlProduct = MagentoProduct & Record<string, string | null | undefined>

export type ProductsResponse = {
    products: {items: GraphqlProduct[]}
}

const QUERY = `
  query GetProducts($filter: ProductAttributeFilterInput!) {
      products(filter: $filter) {           
        items {
          id
          sku  
          media_gallery {
            url    
            label            
          } 
        }
      }
    }
`;

export async function fetchMagentoGalleryData(
    graphqlClient: GraphqlClient,
    sku: string
): Promise<GalleryTile[]> {
    const data = await graphqlClient<ProductsResponse>(
        QUERY,
        {
            filter: {
                sku: {
                    eq: sku
                }
            }
        }
    );

    const product = data.products.items[0];

    if (!product) {
        return [];
    }

    return product.media_gallery.map((image) => ({
        src: image.url,
        ...(image.label !== null
            ? { alt: image.label }
                : {})
    }));
}