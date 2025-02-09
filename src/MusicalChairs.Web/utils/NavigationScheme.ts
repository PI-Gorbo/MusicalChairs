import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { faCircleQuestion, faCircleUser, faHouse, faPersonRunning } from "@fortawesome/free-solid-svg-icons";
import { type RoutesNamesList } from '@typed-router';

type NavigationScheme = {
    [key: string]: {
        route: RoutesNamesList,
        icon: IconDefinition,
        title: string
    }
}

const navigationScheme: NavigationScheme = {
    'drafts': {
        route: 'drafts',
        icon: faCircleQuestion,
        title: 'Drafts'
    },
    'home': {
        route: 'home',
        icon: faHouse,
        title: 'Home'
    },
    'jobs': {
        route: 'jobs',
        icon: faPersonRunning,
        title: 'Jobs'
    },
    'profile': { route: 'profile', icon: faCircleUser, title: 'My Profile' },
} as const;