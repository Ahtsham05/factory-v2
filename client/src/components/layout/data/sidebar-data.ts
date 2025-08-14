import {
  // IconBrowserCheck,
  IconChecklist,
  // IconHelp,
  IconLayoutDashboard,
  IconLockAccess,
  IconMessages,
  // IconNotes,
  // IconPackages,
  // IconPalette,
  // IconSettings,
  // IconTool,
  // IconUserCog,
  IconUsers,
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
import { type SidebarData } from '../types'

export const getSidebarData = (t: (key: string) => string): SidebarData => ({
  user: {
    name: 'admin',
    email: 'admin@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Weaving Factory',
      logo: Command,
      plan: 'Weaving Factory',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: t('sidebar.general'),
      items: [
        {
          title: t('common.dashboard'),
          url: '/',
          icon: IconLayoutDashboard,
        },
        {
          title: t('sidebar.parties'),
          url: '/suppliers',
          icon: IconUsers,
        },
        {
          title: t('sidebar.transactions'),
          url: '/transactions',
          icon: IconChecklist,
        },
        {
          title: t('sidebar.roznamcha'),
          url: '/roznamcha',
          icon: IconChecklist,
        },
        {
          title: t('sidebar.cashBook'),
          url: '/cash-book-detail',
          icon: IconMessages,
        },
        {
          title: t('sidebar.partyLedger'),
          url: '/account-ledger',
          icon: IconLockAccess,
        },
        {
          title: t('sidebar.partyList'),
          url: '/party-detail',
          icon: IconLockAccess,
        },
        {
          title: t('sidebar.backup'),
          url: '/backup',
          icon: IconLockAccess,
        },
      ],
    },
  ],
})

// Keep the original export for backward compatibility
export const sidebarData: SidebarData = {
  user: {
    name: 'admin',
    email: 'admin@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Weaving Factory',
      logo: Command,
      plan: 'Weaving Factory',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
        // {
        //   title: 'Users',
        //   url: '/users',
        //   icon: IconUsers,
        // },
        {
          title: 'Parties',
          url: '/suppliers',
          icon: IconUsers,
        },
        // {
        //   title: 'Customers',
        //   url: '/customers',
        //   icon: IconUsers,
        // },
        // {
        //   title: 'Products',
        //   url: '/products',
        //   icon: IconPackages,
        // },
        // {
        //   title: 'Purchase',
        //   url: '/purchase',
        //   icon: IconPackages,
        // },
        // {
        //   title: 'Sale',
        //   url: '/sale',
        //   icon: IconPackages,
        // },
        // {
        //   title: 'Accounts',
        //   url: '/accounts',
        //   icon: IconChecklist,
        // },
        {
          title: 'Transactions',
          url: '/transactions',
          icon: IconChecklist,
        },
        {
          title: 'Cash Book',
          url: '/cash-book-detail',
          // badge: '3',
          icon: IconMessages,
        },
        {
          title: 'Party Ledger',
          url: '/account-ledger',
          // badge: '3',
          icon: IconLockAccess,
        },
        {
          title: 'Party list',
          url: '/party-detail',
          // badge: '3',
          icon: IconLockAccess,
        },
      {
          title: 'Backup',
          url: '/backup',
          // badge: '3',
          icon: IconLockAccess,
        },
        // {
        //   title: 'Mobile Repairing',
        //   url: '/mobile-repair',
        //   icon: IconMessages,
        // },
        // {
        //   title: 'Jazz Cash & Load',
        //   url: '/mobile-load',
        //   icon: IconMessages,
        // },
        // {
        //   title: 'Chats',
        //   url: '/chats',
        //   badge: '3',
        //   icon: IconMessages,
        // },
      ],
    },
    // {
    //   title: 'Reports',
    //   items: [
    //     {
    //       title: 'Reports',
    //       icon: IconLockAccess,
    //       items: [
    //         {
    //           title: "Customers Ledger",
    //           url: '/customer-ledger',
    //         },
    //         {
    //           title: "Suppliers Ledger",
    //           url: '/supplier-ledger',
    //         },
    //         {
    //           title: "Transaction Ledger",
    //           url: '/transaction-ledger',
    //         },
    //         {
    //           title: "Sale Ledger",
    //           url: '/sale-ledger',
    //         },
    //         {
    //           title: "Purchase Ledger",
    //           url: '/purchase-ledger',
    //         },
    //         {
    //           title: "Account Ledger",
    //           url: '/account-ledger',
    //         }
    //         // {
    //         //   title: 'Sign In',
    //         //   url: '/sign-in',
    //         // },
    //         // {
    //         //   title: 'Sign In (2 Col)',
    //         //   url: '/sign-in-2',
    //         // },
    //         // {
    //         //   title: 'Sign Up',
    //         //   url: '/sign-up',
    //         // },
    //         // {
    //         //   title: 'Forgot Password',
    //         //   url: '/forgot-password',
    //         // },
    //         // {
    //         //   title: 'OTP',
    //         //   url: '/otp',
    //         // },
    //       ],
    //     },
    //     // {
    //     //   title: 'Errors',
    //     //   icon: IconBug,
    //     //   items: [
    //     //     {
    //     //       title: 'Unauthorized',
    //     //       url: '/401',
    //     //       icon: IconLock,
    //     //     },
    //     //     {
    //     //       title: 'Forbidden',
    //     //       url: '/403',
    //     //       icon: IconUserOff,
    //     //     },
    //     //     {
    //     //       title: 'Not Found',
    //     //       url: '/404',
    //     //       icon: IconError404,
    //     //     },
    //     //     {
    //     //       title: 'Internal Server Error',
    //     //       url: '/500',
    //     //       icon: IconServerOff,
    //     //     },
    //     //     {
    //     //       title: 'Maintenance Error',
    //     //       url: '/503',
    //     //       icon: IconBarrierBlock,
    //     //     },
    //     //   ],
    //     // },
    //   ],
    // },
    // {
    //   title: 'Other',
    //   items: [
    //     {
    //       title: 'Settings',
    //       icon: IconSettings,
    //       items: [
    //         {
    //           title: 'Profile',
    //           url: '/settings',
    //           icon: IconUserCog,
    //         },
    //         {
    //           title: 'Account',
    //           url: '/settings/account',
    //           icon: IconTool,
    //         },
    //         {
    //           title: 'Appearance',
    //           url: '/settings/appearance',
    //           icon: IconPalette,
    //         },
    //         {
    //           title: 'Notifications',
    //           url: '/settings/notifications',
    //           icon: IconNotification,
    //         },
    //         {
    //           title: 'Display',
    //           url: '/settings/display',
    //           icon: IconBrowserCheck,
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Help Center',
    //       url: '/help-center',
    //       icon: IconHelp,
    //     },
    //   ],
    // },
  ],
}
