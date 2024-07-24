import React from 'react'
import loadable from '@loadable/component'
import {useLocation} from 'react-router-dom'
import Seo from '@salesforce/retail-react-app/app/components/seo'
import {Box, Skeleton} from '@chakra-ui/react'

import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'

import {Content, isPreviewing} from '@builder.io/sdk-react'
import {customComponents, builderConfig} from '~/builder'
import {useFetchOneEntryWithListener} from '~/builder/blocks/ContentWrapper'

const PageNotFound = loadable(() => import('@salesforce/retail-react-app/app/pages/page-not-found'))

export const MarketingPage = () => {
    const location = useLocation()
    const config = getConfig()

    const urlPath = location.pathname

    const {data, isLoading, isError} = useFetchOneEntryWithListener({
        queryKey: ['Builder-Fetch-marketing', urlPath],
        options: {
            model: builderConfig.pageModel,
            userAttributes: {urlPath},
            apiKey: config.app.builder.api
        }
    })

    if (isLoading) {
        return (
            <Box css={{minHeight: '100vh'}}>
                <Skeleton height="75vh" width="100%" />
            </Box>
        )
    }

    if (!isPreviewing(location.pathname) && isError) {
        return <PageNotFound />
    }

    return (
        <Box css={{minHeight: '100vh'}}>
            {data && (
                <Seo
                    title={data.title}
                    description={data.description}
                    noIndex={data.noIndex}
                    keywords={data.keywords?.join(', ')}
                />
            )}
            <Content
                model={builderConfig.pageModel}
                content={data}
                apiKey={config.app.builder.api}
                enrich={true}
                customComponents={customComponents}
            />
        </Box>
    )
}

export default MarketingPage
