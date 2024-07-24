import React from 'react'
import PropTypes from 'prop-types'
import RecommendedProducts from '@salesforce/retail-react-app/app/components/recommended-products'
import {isPreviewing} from '@builder.io/sdk-react'

export function EinsteinProductsGrid({recommender, title, product}) {
    if (isPreviewing())
        return (
            <Stack spacing={6} {...props}>
                <Skeleton height={6} width="150px" m="auto" />
            </Stack>
        )

    return (
        <RecommendedProducts
            title={title}
            products={product && [product.id]}
            recommender={recommender}
            mx={{base: -4, sm: -6, lg: 0}}
        />
    )
}

EinsteinProductsGrid.propTypes = {
    /** recommender id */
    recommender: PropTypes.string,
    product: PropTypes.object,
    title: PropTypes.string
}

export default EinsteinProductsGrid
