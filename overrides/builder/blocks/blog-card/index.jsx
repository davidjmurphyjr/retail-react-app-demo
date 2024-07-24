import React, {useEffect, useState} from 'react'
import {Text, Skeleton} from '@chakra-ui/react'
import loadable from '@loadable/component'
import {Link} from 'react-router-dom'
import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'
import PropTypes from 'prop-types'

const fallback = <Skeleton height="75vh" width="100%" />
const BlogCard = loadable(() => import('./blog-card'), {fallback})

export function BuilderBlogCard(props) {
    const [article, setArticle] = useState(props.article?.value)
    const builderConfig = getConfig()
    // FIXME: this should be updated to use the gen2 api fetchOneEntry() and associated useQuery pattern
    useEffect(() => {
        async function fetchBlog() {
            setArticle(
                await fetch(
                    `https://cdn.builder.io/api/v2/content/${props.article.model}/${props.article.id}?apiKey=${builderConfig.api}&includeRefs=true`
                ).then((res) => res.json())
            )
        }
        if (props.article?.id) {
            fetchBlog()
        }
    }, [props.article])

    if (article) {
        return (
            <Link to={`/blog/${article.data.slug}`}>
                <BlogCard
                    isColumn={props.isColumn}
                    date={new Date(article.lastUpdated || Date.now())}
                    keywords={article.data.keywords || []}
                    title={article.data.title}
                    excerpt={article.data.excerpt}
                    image={article.data.image}
                    author={article.data.author.value?.data || {}}
                />
            </Link>
        )
    }
    return <Text>Pick an article</Text>
}

BuilderBlogCard.propTypes = {
    article: PropTypes.any,
    isColumn: PropTypes.bool
}

export const BlogCardDefinition = {
    component: BuilderBlogCard,
    name: 'BlogCard',
    image: 'https://cdn.builder.io/api/v1/image/assets%2Fd1ed12c3338144da8dd6b63b35d14c30%2Fbcac0e5a87ac4ad29b37d5159a63dbca',
    inputs: [
        {
            name: 'article',
            type: 'reference',
            model: 'blog-article'
        },
        {
            name: 'isColumn',
            friendlyName: 'Stack vertically',
            type: 'boolean'
        }
    ]
}
