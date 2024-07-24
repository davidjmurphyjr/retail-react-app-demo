/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {useIntl} from 'react-intl'
import {SimpleGrid, Button} from '@salesforce/retail-react-app/app/components/shared/ui'
import {
    useProducts,
    useCustomerId,
    useShopperCustomersMutation
} from '@salesforce/commerce-sdk-react'

import {useToast} from '@salesforce/retail-react-app/app/hooks/use-toast'

import {
    API_ERROR_MESSAGE,
    TOAST_ACTION_VIEW_WISHLIST,
    TOAST_MESSAGE_ADDED_TO_WISHLIST,
    TOAST_MESSAGE_REMOVED_FROM_WISHLIST
} from '@salesforce/retail-react-app/app/constants'

import {useWishList} from '@salesforce/retail-react-app/app/hooks/use-wish-list'
import useNavigation from '@salesforce/retail-react-app/app/hooks/use-navigation'
import ProductTile, {
    Skeleton as ProductTileSkeleton
} from '@salesforce/retail-react-app/app/components/product-tile'

const numberOfSkeletonItems = 3

const ProductsGrid = ({productIds}) => {
    const {formatMessage} = useIntl()
    const toast = useToast()
    const navigate = useNavigation()

    const {data: products, isLoading: isProductsLoading} = useProducts(
        {parameters: {ids: productIds, allImages: true}},
        {enabled: productIds?.length > 0}
    )

    const customerId = useCustomerId()

    const [wishlistLoading, setWishlistLoading] = useState([])

    const {mutateAsync: createCustomerProductListItem} = useShopperCustomersMutation(
        'createCustomerProductListItem'
    )
    const {mutateAsync: deleteCustomerProductListItem} = useShopperCustomersMutation(
        'deleteCustomerProductListItem'
    )

    /**************** Action Handlers ****************/
    const {data: wishlist, isLoading: isWishlistLoading} = useWishList()
    const addItemToWishlist = async (product) => {
        setWishlistLoading([...wishlistLoading, product.productId])

        // TODO: This wishlist object is from an old API, we need to replace it with the new one.
        const listId = wishlist.id
        await createCustomerProductListItem(
            {
                parameters: {customerId, listId},
                body: {
                    quantity: 1,
                    public: false,
                    priority: 1,
                    type: 'product',
                    productId: product.productId
                }
            },
            {
                onError: () => {
                    toast({
                        title: formatMessage(API_ERROR_MESSAGE),
                        status: 'error'
                    })
                },
                onSuccess: () => {
                    toast({
                        title: formatMessage(TOAST_MESSAGE_ADDED_TO_WISHLIST, {quantity: 1}),
                        status: 'success',
                        action: (
                            // it would be better if we could use <Button as={Link}>
                            // but unfortunately the Link component is not compatible
                            // with Chakra Toast, since the ToastManager is rendered via portal
                            // and the toast doesn't have access to intl provider, which is a
                            // requirement of the Link component.
                            <Button variant="link" onClick={() => navigate('/account/wishlist')}>
                                {formatMessage(TOAST_ACTION_VIEW_WISHLIST)}
                            </Button>
                        )
                    })
                },
                onSettled: () => {
                    setWishlistLoading(wishlistLoading.filter((id) => id !== product.productId))
                }
            }
        )
    }

    const removeItemFromWishlist = async (product) => {
        setWishlistLoading([...wishlistLoading, product.productId])

        const listId = wishlist.id
        const itemId = wishlist.customerProductListItems.find(
            (i) => i.productId === product.productId
        ).id

        await deleteCustomerProductListItem(
            {
                parameters: {customerId, listId, itemId}
            },
            {
                onError: () => {
                    toast({
                        title: formatMessage(API_ERROR_MESSAGE),
                        status: 'error'
                    })
                },
                onSuccess: () => {
                    toast({
                        title: formatMessage(TOAST_MESSAGE_REMOVED_FROM_WISHLIST),
                        status: 'success'
                    })
                },
                onSettled: () => {
                    setWishlistLoading(wishlistLoading.filter((id) => id !== product.productId))
                }
            }
        )
    }

    const isPageLoading = isProductsLoading || isWishlistLoading

    return (
        <SimpleGrid columns={[2, 2, 3, 3]} spacingX={4} spacingY={{base: 12, lg: 16}}>
            {isPageLoading
                ? new Array(productIds?.length || numberOfSkeletonItems)
                      .fill(0)
                      .map((_, index) => (
                          <ProductTileSkeleton
                              key={index}
                              data-testid="product-scroller-item-skeleton"
                          />
                      ))
                : products?.map((product) => {
                      const isInWishlist = !!wishlist?.customerProductListItems?.find(
                          (item) => item.productId === product.id
                      )

                      return (
                          <>
                              <ProductTile
                                  data-testid={`sf-product-tile-${product.id}`}
                                  key={product.id}
                                  product={product}
                                  enableFavourite={true}
                                  isFavourite={isInWishlist}
                                  onFavouriteToggle={(isFavourite) => {
                                      const action = isFavourite
                                          ? addItemToWishlist
                                          : removeItemFromWishlist
                                      return action(product)
                                  }}
                                  dynamicImageProps={{
                                      widths: ['70vw', '70vw', '40vw', '30vw']
                                  }}
                              />
                          </>
                      )
                  })}
        </SimpleGrid>
    )
}

ProductsGrid.propTypes = {
    productIds: PropTypes.any
}

export default ProductsGrid
