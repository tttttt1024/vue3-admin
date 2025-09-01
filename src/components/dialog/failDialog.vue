<template>
    <div v-if="state.errorDialogVisible" id="TaskManagerMessageCenter">
        <div id="message-offline" class="message-content pop-in">
            <div class="msg-title">
                <p>{{ props.title }}</p>
                <close-outlined class="icon-close close-btn" @click="state.errorDialogVisible = false" />
            </div>
            <div style="padding: 15px">
                <div class="error-top">
                    <em class="el-icon-info"></em><span>{{ msgTop }}</span>
                </div>
                <div class="import-file">
                    <img class="import-file-img" src="/src/assets/image/excel.png" alt="" />
                    <div v-if="fileInfoData.name" class="import-file-info">
                        <div class="file-name">{{ fileInfoData.name }}</div>
                        <div class="file-size">{{ fileInfoData.size }}KB</div>
                    </div>
                    <a-button type="text" :loading="state.downloading" class="import-file-look"
                        @click="showFile">查看</a-button>
                </div>
                <div class="error-bottom">{{ msgBottom }}</div>
                <div class="tips-text">
                    {{ tips }}
                </div>
                <div class="foot-btn">
                    <a-button type="primary" @click="state.errorDialogVisible = false">确定</a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue"
import { downloadBlobAsync } from "@/lib/tool"
const props = defineProps<{
    fileInfo: any,
    title: string,
    msg: string,
    tips: string,
}>()
const state = reactive({
    errorDialogVisible: false,
    downloading: false
})
async function showFile() {
    try {
        state.downloading = true
        await downloadBlobAsync(props.fileInfo, props.fileInfo.name)
    } catch (e) {
        console.log(e)
    } finally {
        state.downloading = false
    }
}
function open() {
    state.errorDialogVisible = true
}
defineExpose({ open })
const msgBottom = computed(() => {
    return props.msg?.split("|")?.[1];
})
const msgTop = computed(() => {
    return props.msg?.split("|")?.[0];
})
const fileInfoData: any = computed(() => {
    return {
        name: props.fileInfo.name,
        size: Math.ceil(props.fileInfo.size / 1024),
        file: props.fileInfo.raw,
    }
})
</script>

<style scoped lang='scss'>
#TaskManagerMessageCenter {
    position: fixed;
    left: 100%;
    bottom: 0;
    z-index: 9999;

    .message-content {
        margin-bottom: 16px;
        width: 420px;
        background-color: $--cas-color10;
        border-radius: 5px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: all 0.3s;
    }

    .pop-in {
        transform: translateX(-105%);
    }

    .pop-out {
        height: 0;
        margin: 0;
        opacity: 0;
        transform: translateX(-105%);
    }

    p {
        display: inline-block;
    }

    .close-btn {
        float: right;
        margin: 0.9rem 0;
        cursor: pointer;
    }

    .msg-title {
        background-color: $--cas-color1;
        color: $--cas-color10;
        font-size: 16px;
        font-weight: bold;
        line-height: 3rem;
        padding: 0 1rem;
    }

    .error-top {
        display: flex;
        align-items: center;
        background-color: #fef0f0;
        font-size: 13px;
        color: #959595;
        padding: 5px 10px;

        .el-icon-info {
            margin-right: 15px;
            color: #fb4945;
            font-size: 20px;
        }
    }

    .import-file {
        display: flex;
        align-items: center;
        font-size: 14px;
        background-color: #f4f6f8;
        padding: 20px;
        margin: 10px auto;

        &-img {
            width: 60px;
            height: 50px;
            margin-right: 10px;
        }

        &-info {
            .file-name {
                font-weight: bold;
                color: #333;
            }

            .file-size {
                color: #959595;
            }
        }

        &-look {
            margin-left: auto;
            color: #306fcf;
            cursor: pointer;
        }
    }

    .msg-content {
        margin: 1rem 0;
        padding: 0 1.5rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        word-break: break-all;
    }

    .error-bottom {
        font-size: 14px;
        color: #959595;
    }
}

.tips-text {
    color: rgba(0, 0, 0, 0.5);
    overflow: auto;
    max-height: 200px;
}

.foot-btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}
</style>
