export type MergedAttribute = {
    code: string
    label: string
    options: MergedAttributeOption[]
}

export type MergedAttributeOption = {
    value: string
    label: string
    totalCount: number
    filteredCount: number
    isAvailable: boolean
    visual?: {
        type: "color" | "image"
        value: string
    }
}

export const LAYERED_ATTRIBUTE_DATA = `
  query MagentoProducts($filter: ProductAttributeFilterInput!) {
      products(filter: $filter) {
        total_count
        aggregations{
          attribute_code
          label
          count
          options{
            count
            label
            value
            swatch_data {
                value
                type
            }
          }
        }
      }
    }
`;