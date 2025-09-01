<script>
import useStore from "@/store/";
import useUserStore from '@/store/user'

export default {
  name: 'Auth',
  data() {
    const { info, btnInfo } = useUserStore()
    return {
      info, btnInfo
    }
  },
  props: {
    funCode: {
      type: String,
    }
  },
  computed: {
    isAuthed() {
      const store = useStore();
      return (funCode) =>
        (this.funCode === '*' || this.funCode === '' || this.funCode === void 0)
          ? true : this.info?.funCode.find(code => code == funCode)
    },
    buttonInfo() {
      const store = useStore();
      return (funCode) => this.btnInfo?.find(btn => btn.funCode == funCode)
    }
  },
  render() {
    return this.isAuthed(this.funCode) ? this.$slots.default() : null;
  }
}
</script>
