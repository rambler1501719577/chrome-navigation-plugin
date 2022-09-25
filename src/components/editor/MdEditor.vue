<template>
    <div class="rambler-markdown-editor">
        <mavonEditor
            :subfield="false"
            defaultOpen="preview"
            :toolbarsFlag="false"
            :editable="false"
            :style="style"
            v-model="content"
            :ishljs="true"
            ref="md"
            :previewBackground="background"
            :codeStyle="codeStyle"
            :externalLink="externalLink"
        ></mavonEditor>
    </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor';
export default {
    name: 'MdEditor',
    props: {
        content: {
            type: String,
            default: '没有内容'
        },
        background: {
            type: String,
            default: '#fff'
        }
    },
    computed: {
        style: function() {
            return {
                zIndex: '99',
                width: '100%'
            };
        }
    },
    data: function() {
        return {
            codeStyle: 'atom-one-dark', // 代码风格
            externalLink: {
                markdown_css: function() {
                    // 这是你的markdown css文件路径
                    return '/mavon-editor/markdown/github-markdown.min.css';
                },
                hljs_js: function() {
                    // 这是你的hljs文件路径
                    return '/mavon-editor/highlightjs/highlight.min.js';
                },
                katex_css: function() {
                    // 这是你的katex配色方案路径路径
                    return '/mavon-editor/katex/katex.min.css';
                },
                katex_js: function() {
                    // 这是你的katex.js路径
                    return '/mavon-editor/katex/katex.min.js';
                }
            }
        };
    },
    components: {
        mavonEditor
    }
};
</script>

<style></style>
