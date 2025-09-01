import commonIcon from "@/components/common/Icon.vue"

export default {
  name: "SubMenu",
  props: ["menuInfo","collapsed"],
  components: {
    commonIcon
  },
  template: `
    <a-sub-menu v-if="menuInfo.funType === 0" :key="menuInfo.route">
      <template #title>
        <span>
          <common-icon :icon="menuInfo.icon" customClass="menu-img" />
          <span v-show="!collapsed">{{ menuInfo.funName }}</span>
        </span>
      </template>
      <template v-for="item in menuInfo.children" :key="item.route">
      <template v-if="item.children.length">
          <sub-menu :menu-info="item" />
        </template>
        <template v-else>
          <a-menu-item :key="item.route" :title="item.funName">
            <span><common-icon :icon="item.icon" customClass="menu-img" />
            <span>{{ item.funName }}</span></span>
          </a-menu-item>
        </template>
      </template>
    </a-sub-menu>
  `,
} as any;
