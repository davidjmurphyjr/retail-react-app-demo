import React from 'react'
import loadable from '@loadable/component'
import {Skeleton} from '@chakra-ui/react'

const fallback = <Skeleton height="75vh" width="100%" />
const ProductsGrid = loadable(() => import('./products-grid'), {fallback})

export const ProductsGridDefinition = {
    component: ProductsGrid,
    name: 'ProductsGrid',
    image: 'https://unpkg.com/css.gg@2.0.0/icons/svg/list.svg',
    inputs: [
        {
            name: 'productIds',
            friendlyName: 'Products',
            type: 'SFCommerceProductsList',
            required: true
        }
    ]
}
