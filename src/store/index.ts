import useUserStore from './user'
import useNavStore from './nav'
import usePageStore from './page'
import useSocketStore from './socket'
import useHeaderTipStore from './headerTip'
import useDict from './dict'
export default function useStore() {
  return {
    user: useUserStore(),
    nav: useNavStore(),
    page: usePageStore(),
    socket: useSocketStore(),
    headerTip: useHeaderTipStore(),
    dict: useDict()
  }
}
