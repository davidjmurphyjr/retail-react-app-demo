/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react'
import loadable from '@loadable/component'
import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'

// Components
import {Skeleton} from '@salesforce/retail-react-app/app/components/shared/ui'
import {configureRoutes} from '@salesforce/retail-react-app/app/utils/routes-utils'
import {routes as _routes} from '@salesforce/retail-react-app/app/routes'
import MarketingPages from './pages/marketing-pages'

const fallback = <Skeleton height="75vh" width="100%" />

// Create your pages here and add them to the routes array
// Use loadable to split code into smaller js chunks
const Home = loadable(() => import('./pages/home'), {fallback})
const MyNewRoute = loadable(() => import('./pages/my-new-route'))

const routes = [
    {
        path: '/',
        component: Home,
        exact: true
    },
    {
        path: '/my-new-route',
        component: MyNewRoute
    },
    // Add a catchall route for marketing pages that also handles 404's
    // Make sure your catchall route is the last route in the array
    {
        path: '*',
        component: MarketingPages
    }
]

const overridePaths = routes.map((route) => route.path)

// Insert the overridden routes before the template paths, but use our custom catchall route at the end
routes.splice(
    routes.length - 1,
    0,
    ..._routes.filter((route) => !overridePaths.includes(route.path))
)

export default () => {
    const config = getConfig()
    return configureRoutes(routes, config, {
        ignoredRoutes: ['/callback', '*']
    })
}
