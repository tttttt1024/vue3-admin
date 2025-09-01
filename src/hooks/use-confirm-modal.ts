import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { Modal, type ModalFuncProps } from 'ant-design-vue'

const typeMap = {
  delete: {
    title: '提示',
    icon: h(ExclamationCircleOutlined),
    content: '确定删除该条数据?',
    centered: true,
    onOk() {},
  },
}
const useConfirmModal = (type: keyof typeof typeMap, option?: ModalFuncProps) => {
  Modal.confirm({ ...typeMap[type], ...option })
}

export default useConfirmModal
