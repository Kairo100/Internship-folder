// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

// Admin/User Account Navigation
const adminNavigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: 'tabler:smart-home',

      // badgeContent: 'new',
      // badgeColor: 'error',
      path: '/dashboard'
    },
    {
      sectionTitle: 'Managements'
    },
    {
      title: 'Projects',
      icon: 'tabler:packages',
      path: '/projects'
    },
    {
      title: 'Updates',
      icon: 'tabler:rotate-rectangle',
      path: '/updates'
    },
    {
      title: 'Organisation',
      icon: 'tabler:affiliate',
      path: '/organisations'
    },
    // {
    //   title: 'Submissions',
    //   icon: 'tabler:browser-check',
    //   path: '/submissions'
    // },
    {
      title: 'Users',
      icon: 'tabler:users-group',
      path: '/users'
    },
    {
      sectionTitle: 'Others'
    },
    {
      title: 'Contacts',
      icon: 'tabler:address-book',
      path: '/contacts'
    },
    {
      title: 'Project Maps',
      icon: 'tabler:map-pin',
      path: '/map'
    }
  ]
}

// Organization Member Navigation
const organizationNavigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: 'tabler:smart-home',
      path: '/dashboard'
    },
    {
      title: 'Projects',
      icon: 'tabler:packages',
      path: '/projects'
    },
    {
      title: 'Updates',
      icon: 'tabler:rotate-rectangle',
      path: '/updates'
    },
    {
      title: 'Members',
      icon: 'tabler:users-group',
      path: '/organization/members'
    }
  ]
}

// Main navigation function that returns appropriate nav based on user type
const navigation = (userType?: string): VerticalNavItemsType => {
  if (userType === 'organisation_member') {
    return organizationNavigation()
  }
  return adminNavigation()
}

export default navigation
