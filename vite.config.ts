import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import autoprefixer from "autoprefixer";
import { createHtmlPlugin } from "vite-plugin-html";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import viteCompression from "vite-plugin-compression";
// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const publicPath = env.VITE_APP_BASE;
  const configFilePath = env.VITE_APP_BASE_CONFIG_FILE_PATH
    ? publicPath + env.VITE_APP_BASE_CONFIG_FILE_PATH
    : "/config.js";
  console.log({ env, configFilePath, publicPath });
  return defineConfig({
    base: env.VITE_APP_BASE,
    server: {
      host: "0.0.0.0",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        vue: "vue/dist/vue.esm-bundler.js",
      },
    },
    css: {
      postcss: {
        plugins: [autoprefixer()],
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/style/variable.scss";`, //注册scss全局变量
        },
      },
    },
    plugins: [
      vue(),
      createHtmlPlugin({
        inject: {
          data: {
            configFilePath,
          },
        },
      }),
      //自动引入对应库的api
      AutoImport({
        imports: ["vue", "vue-router", "pinia"],
        dts: "./types/auto-imports.d.ts",
        eslintrc: {
          enabled: true,
        },
      }),
      Components({
        // dirs: ["src/components"], //自动引入该目录下组件
        extensions: ["vue"],
        resolvers: [
          //自动引入antdv组件
          AntDesignVueResolver({
            importStyle: false, // css in js
            resolveIcons: true, //自动引入antdv图标组件
          }),
        ],
        dts: "./types/components.d.ts",
      }),
      viteCompression({
        // gzip 压缩
        threshold: 10240, // 文件超过10k压缩
        algorithm: "gzip",
        ext: ".gz",
        deleteOriginFile: false, // 压缩后是否删除源文件
      }),
    ],
    build: {
      outDir: "docs", // 指定输出目录为docs
      assetsDir: "assets", // 静态资源目录
      rollupOptions: {
        output: {
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
          //拆包并行加载
          manualChunks: {
            vue: ["vue"],
            antdv: ["ant-design-vue"],
            axios: ["axios"],
            echarts: ["echarts"],
          },
        },
      },
      // 消除打包大小超过500kb警告
      // chunkSizeWarningLimit: 2000,
      minify: "terser",
      /** 在打包代码时移除 console.log、debugger 和 注释 */
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ["console.log"],
        },
        format: {
          comments: false, //是否保留注释
        },
      },
    },
    define: {
      __LOCAL__: false,
    },
  });
};
