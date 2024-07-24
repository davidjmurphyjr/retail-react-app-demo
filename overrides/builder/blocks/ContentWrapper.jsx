import React, {useMemo, useState, useEffect} from 'react'
import {useQuery} from '@tanstack/react-query'
import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'
import {Content, fetchOneEntry, isPreviewing, subscribeToEditor} from '@builder.io/sdk-react'
import {customComponents as defaultCustomComponents} from '~/builder'

// One approach, a Component Generator to make creating Builder.io content fetching components simple
// Defaults to all customComponents available, but can take a customComponents prop to override
// Useful when you only have a single content area with no additional JSX is used
export const BuilderSingleEntryContentGenerator = ({
    queryKey,
    model,
    options = {enrich: true},
    skeleton,
    customComponents = defaultCustomComponents
}) => {
    const BuilderComponent = () => {
        const config = getConfig()
        const {data, isLoading, isError} = useQuery({
            queryKey: [...(typeof queryKey === 'string' ? [queryKey] : queryKey)],
            queryFn: async () => {
                return await fetchOneEntry({
                    model,
                    apiKey: config.app.builder.api,
                    ...options
                    // enrich is on by default for fetchOneEntry()
                })
            }
        })

        if ((!data && !isLoading) || !isPreviewing()) return null
        if (!isPreviewing() && isLoading && skeleton) return skeleton
        return (
            <Content
                model={model}
                content={data}
                enrich={options.enrich ?? false}
                apiKey={config.app.builder.api}
                customComponents={customComponents}
            />
        )
    }
    return BuilderComponent
}

// A more Hooks-based approach, for React-style fetching, must render the Content component manually
// Pros: Get to choose Content props manually
export const useFetchOneEntry = ({queryKey, options, enabled = true}) => {
    const apiKey = getConfig().app.builder.api
    const query = useQuery({
        queryKey: [
            ...(typeof queryKey === 'string'
                ? [queryKey]
                : Array.isArray(queryKey)
                ? queryKey
                : ['Builder-Fetch-Content'])
        ],
        queryFn: async () => {
            return await fetchOneEntry({
                apiKey,
                ...options
            })
        },
        enabled
    })

    return {...query, apiKey}
}

// FetchOneEntry but also listen to PageModel changes
export const useFetchOneEntryWithListener = ({queryKey, options, enabled = true}) => {
    const apiKey = getConfig().app.builder.api
    const [previewData, setPreviewData] = useState(null)
    const {data: queryData, ...queryRest} = useQuery({
        queryKey: [
            ...(typeof queryKey === 'string'
                ? [queryKey]
                : Array.isArray(queryKey)
                ? queryKey
                : ['Builder-Fetch-Content'])
        ],
        queryFn: async () => {
            return await fetchOneEntry({
                apiKey,
                ...options
            })
        },
        onSuccess: (data) => {
            setPreviewData(data)
        },
        enabled
    })

    const memoData = useMemo(() => {
        return previewData ?? queryData
    }, [queryData, previewData])

    useEffect(() => {
        const unsubscribe = subscribeToEditor(options.model, (data) => setPreviewData(data))
        return () => unsubscribe()
    }, [])

    return {data: memoData, ...queryRest, apiKey}
}
