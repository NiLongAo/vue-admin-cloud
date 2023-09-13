import { defineApplicationConfig } from '@vben/vite-config';

export default defineApplicationConfig({
  overrides: {
    optimizeDeps: {
      include: [
        'echarts/core',
        'echarts/charts',
        'echarts/components',
        'echarts/renderers',
        'qrcode',
        '@iconify/iconify',
        'ant-design-vue/es/locale/zh_CN',
        'ant-design-vue/es/locale/en_US',
      ],
    },
    server: {
      proxy: {
        '/basic-api': {
          target: 'https://www.nilongao.cn/basic-api',//http://192.168.1.26:9190 https://www.nilongao.cn/basic-api
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/basic-api`), ''),
          // only https
          // secure: false
        },
        '/upload': {
          target: 'http://localhost:3300/upload',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/upload`), ''),
        },
      },
    },
    //解决  vue-i18n 报错 Failed to resolve entry for package "@intlify/shared" 后续版本修复后再克删除
    // https://github.com/intlify/vue-i18n-next/issues/1521
    resolve:{
      alias: {
        "vue-i18n": "vue-i18n/dist/vue-i18n.esm-bundler.js", // After modification
      },
    }
  },
});
