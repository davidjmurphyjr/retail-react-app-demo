import React from 'react'
import loadable from '@loadable/component'
import {Skeleton} from '@chakra-ui/react'

const fallback = <Skeleton height="75vh" width="100%" />
const ProductDetail = loadable(() => import('./product-detail'), {fallback})

export const ProductDetailDefinition = {
    component: ProductDetail,
    name: 'ProductBox', // for backwards compatibility with the existing CMS code
    image: 'https://unpkg.com/css.gg@2.0.0/icons/svg/box.svg',
    inputs: [
        {
            name: 'productRef',
            friendlyName: 'Product',
            type: 'SFCommerceProduct',
            required: true
        }
    ]
}
