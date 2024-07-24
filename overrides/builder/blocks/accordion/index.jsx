/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React, {useState} from 'react'
import {Blocks} from '@builder.io/sdk-react'

// TEMPORARY ACCORDION COMPONENT THAT SHOULD BE REPLACED WITH THE BUILDER.IO ACCORDION COMPONENT ONCE PUBLISHED
export const Accordion = (props) => {
    const {items, oneAtATime, grid, defaultOpen, builderBlock, gridRowWidth, useChildrenForItems} =
        props
    // Initialize visibility state for each item
    const [visibility, setVisibility] = useState(items.map(() => true))

    const toggleVisibility = (index) => {
        setVisibility((prevVisibility) => {
            const newVisibility = [...prevVisibility]
            newVisibility[index] = !newVisibility[index]
            return newVisibility
        })
    }
    return (
        <div>
            {items.map((item, index) => (
                <div key={index}>
                    <div onClick={() => toggleVisibility(index)}>
                        <Blocks
                            parent={builderBlock.id}
                            path={`component.options.items.${index}.label`}
                            blocks={item.title}
                        />
                    </div>
                    {visibility[index] && (
                        <Blocks
                            parent={builderBlock.id}
                            path={`component.options.items.${index}.detail`}
                            blocks={item.detail}
                        />
                    )}
                </div>
            ))}
            <pre>
                {JSON.stringify(
                    {
                        oneAtATime,
                        grid,
                        defaultOpen,
                        gridRowWidth,
                        useChildrenForItems
                    },
                    null,
                    2
                )}
            </pre>
        </div>
    )
}

const defaultTitle = {
    '@type': '@builder.io/sdk:Element',
    layerName: 'Accordion item title',
    responsiveStyles: {
        large: {
            marginTop: '10px',
            position: 'relative',
            display: 'flex',
            alignItems: 'stretch',
            flexDirection: 'column',
            paddingBottom: '10px'
        }
    },
    children: [
        {
            '@type': '@builder.io/sdk:Element',
            responsiveStyles: {
                large: {
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column'
                }
            },
            component: {
                name: 'Text',
                options: {
                    text: 'I am an accordion title. Click me!'
                }
            }
        }
    ]
}

const defaultDetail = {
    '@type': '@builder.io/sdk:Element',
    layerName: 'Accordion item detail',
    responsiveStyles: {
        large: {
            position: 'relative',
            display: 'flex',
            alignItems: 'stretch',
            flexDirection: 'column',
            marginTop: '10px',
            paddingBottom: '10px'
        }
    },
    children: [
        {
            '@type': '@builder.io/sdk:Element',
            responsiveStyles: {
                large: {
                    paddingTop: '50px',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingBottom: '50px'
                }
            },
            component: {
                name: 'Text',
                options: {
                    text: 'I am an accordion detail, hello!'
                }
            }
        }
    ]
}

export const AccordionDefinition = {
    component: Accordion,
    name: 'Builder:Accordion',
    override: true,
    canHaveChildren: true,
    image: 'https://cdn.builder.io/api/v1/image/assets%2FagZ9n5CUKRfbL9t6CaJOyVSK4Es2%2Ffab6c1fd3fe542408cbdec078bca7f35',
    defaultStyles: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch'
    },
    inputs: [
        {
            name: 'items',
            type: 'list',
            broadcast: true,
            subFields: [
                {
                    name: 'title',
                    type: 'uiBlocks',
                    hideFromUI: true,
                    defaultValue: [defaultTitle]
                },
                {
                    name: 'detail',
                    type: 'uiBlocks',
                    hideFromUI: true,
                    defaultValue: [defaultDetail]
                }
            ],
            defaultValue: [
                {
                    title: [defaultTitle],
                    detail: [defaultDetail]
                },
                {
                    title: [defaultTitle],
                    detail: [defaultDetail]
                }
            ],
            showIf: (options) => !options.get('useChildrenForItems')
        },
        {
            name: 'oneAtATime',
            helperText:
                'Only allow opening one at a time (collapse all others when new item openned)',
            type: 'boolean',
            defaultValue: false
        },
        {
            name: 'grid',
            helperText: 'Display as a grid',
            type: 'boolean',
            defaultValue: false
        },
        {
            name: 'gridRowWidth',
            helperText: 'Display as a grid',
            type: 'string',
            showIf: (options) => options.get('grid'),
            defaultValue: '25%'
        },
        {
            name: 'useChildrenForItems',
            type: 'boolean',
            helperText:
                'Use child elements for each slide, instead of the array. Useful for dynamically repeating items',
            advanced: true,
            defaultValue: false,
            onChange: (options) => {
                if (options.get('useChildrenForItems') === true) {
                    options.set('items', [])
                }
            }
        }
    ]
}
