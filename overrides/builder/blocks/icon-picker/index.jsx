import React from 'react'
import PropTypes from 'prop-types'
import {
    AmexIcon,
    AlertIcon,
    AccountIcon,
    BrandLogo,
    BasketIcon,
    CheckIcon,
    CheckCircleIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    CVVIcon,
    DashboardIcon,
    DiscoverIcon,
    FigmaLogo,
    FilterIcon,
    FileIcon,
    FlagCAIcon,
    FlagUSIcon,
    FlagGBIcon,
    FlagFRIcon,
    FlagITIcon,
    FlagCNIcon,
    FlagJPIcon,
    GithubLogo,
    HamburgerIcon,
    InfoIcon,
    LikeIcon,
    LockIcon,
    LocationIcon,
    PaypalIcon,
    PlugIcon,
    PlusIcon,
    MastercardIcon,
    ReceiptIcon,
    SearchIcon,
    SocialFacebookIcon,
    SocialInstagramIcon,
    SocialPinterestIcon,
    SocialTwitterIcon,
    SocialYoutubeIcon,
    SignoutIcon,
    UserIcon,
    VisaIcon,
    VisibilityIcon,
    VisibilityOffIcon,
    HeartIcon,
    HeartSolidIcon,
    CloseIcon
} from '@salesforce/retail-react-app/app/components/icons'

// Exporting a map of icon names to component names
export const iconMap = {
    'cc-amex': AmexIcon,
    alert: AlertIcon,
    account: AccountIcon,
    'brand-logo': BrandLogo,
    basket: BasketIcon,
    check: CheckIcon,
    'check-circle': CheckCircleIcon,
    'chevron-down': ChevronDownIcon,
    'chevron-left': ChevronLeftIcon,
    'chevron-right': ChevronRightIcon,
    'chevron-up': ChevronUpIcon,
    'cc-cvv': CVVIcon,
    dashboard: DashboardIcon,
    'cc-discover': DiscoverIcon,
    'figma-logo': FigmaLogo,
    filter: FilterIcon,
    file: FileIcon,
    'flag-ca': FlagCAIcon,
    'flag-us': FlagUSIcon,
    'flag-gb': FlagGBIcon,
    'flag-fr': FlagFRIcon,
    'flag-it': FlagITIcon,
    'flag-cn': FlagCNIcon,
    'flag-jp': FlagJPIcon,
    'github-logo': GithubLogo,
    hamburger: HamburgerIcon,
    info: InfoIcon,
    like: LikeIcon,
    lock: LockIcon,
    location: LocationIcon,
    paypal: PaypalIcon,
    plug: PlugIcon,
    plus: PlusIcon,
    'cc-mastercard': MastercardIcon,
    receipt: ReceiptIcon,
    search: SearchIcon,
    'social-facebook': SocialFacebookIcon,
    'social-instagram': SocialInstagramIcon,
    'social-pinterest': SocialPinterestIcon,
    'social-twitter': SocialTwitterIcon,
    'social-youtube': SocialYoutubeIcon,
    signout: SignoutIcon,
    user: UserIcon,
    'cc-visa': VisaIcon,
    visibility: VisibilityIcon,
    'visibility-off': VisibilityOffIcon,
    heart: HeartIcon,
    'heart-solid': HeartSolidIcon,
    close: CloseIcon
}

// Exporting an array of icon names dynamically
export const iconNames = Object.keys(iconMap)

export const Icon = ({iconName, ...props}) => {
    const IconComponent = iconMap[iconName]

    if (!IconComponent) {
        return null
    }

    return <IconComponent {...props} />
}

Icon.propTypes = {
    iconName: PropTypes.string.isRequired
}

export const IconDefinition = {
    component: Icon,
    name: 'IconPicker',
    image: 'https://unpkg.com/css.gg@2.0.0/icons/svg/smile.svg',
    inputs: [
        {
            name: 'iconName',
            friendlyName: 'Icon',
            type: 'string',
            enum: iconNames,
            required: true
        }
    ]
}

export default Icon
