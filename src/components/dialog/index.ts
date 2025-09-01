

import createModalComponent from "./tool";
import confirmModal from '@/components/dialog/confirm.vue';
import filePreview from "./filePreview.vue";
export const confirmFn = createModalComponent(confirmModal);
export const filePreviewFn = createModalComponent(filePreview);