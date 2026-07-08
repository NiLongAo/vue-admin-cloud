import type { RouteRecordRaw } from 'vue-router';

import {
  VBEN_ANTDV_NEXT_PREVIEW_URL,
  VBEN_ELE_PREVIEW_URL,
  VBEN_LOGO_URL,
  VBEN_NAIVE_PREVIEW_URL,
  VBEN_TD_PREVIEW_URL,
} from '@vben/constants';
import { SvgAntdvNextLogoIcon, SvgTDesignIcon } from '@vben/icons';

import { IFrameView } from '#/layouts';
import { $t } from '#/locales';
import { PERSONAL_CENTER_PATH } from '#/router/personal-center';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      badgeType: 'dot',
      icon: VBEN_LOGO_URL,
      order: 9998,
      title: $t('demos.vben.title'),
    },
    name: 'VbenProject',
    path: '/vben-admin',
    children: [
      {
        name: 'VbenAntdVNext',
        path: 'antdv-next',
        component: IFrameView,
        meta: {
          badgeType: 'dot',
          icon: SvgAntdvNextLogoIcon,
          link: VBEN_ANTDV_NEXT_PREVIEW_URL,
          title: $t('demos.vben.antdv-next'),
        },
      },
      {
        name: 'VbenNaive',
        path: 'naive',
        component: IFrameView,
        meta: {
          badgeType: 'dot',
          icon: 'logos:naiveui',
          link: VBEN_NAIVE_PREVIEW_URL,
          title: $t('demos.vben.naive-ui'),
        },
      },
      {
        name: 'VbenTDesign',
        path: 'tdesign',
        component: IFrameView,
        meta: {
          badgeType: 'dot',
          icon: SvgTDesignIcon,
          link: VBEN_TD_PREVIEW_URL,
          title: $t('demos.vben.tdesign'),
        },
      },
      {
        name: 'VbenElementPlus',
        path: 'ele',
        component: IFrameView,
        meta: {
          badgeType: 'dot',
          icon: 'logos:element',
          link: VBEN_ELE_PREVIEW_URL,
          title: $t('demos.vben.element-plus'),
        },
      },
    ],
  },
  {
    name: 'VbenAbout',
    path: '/vben-admin/about',
    component: () => import('#/views/_core/about/index.vue'),
    meta: {
      icon: 'lucide:copyright',
      title: $t('demos.vben.about'),
      order: 9999,
    },
  },
  {
    name: 'Profile',
    path: '/profile',
    redirect: PERSONAL_CENTER_PATH,
    meta: {
      icon: 'lucide:user',
      hideInMenu: true,
      title: $t('page.auth.profile'),
    },
  },
];

export default routes;
