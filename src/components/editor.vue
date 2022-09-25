<template>
	<div class="editor">
		<div ref="toolbar" class="toolbar"></div>
		<div ref="editor" class="text"></div>
	</div>
</template>

<script>
//此处的uploadPath 为后端提供的上传图片的接口
import E from 'wangeditor';
import { uploadImageToSSO } from '@/api/modules/article';
export default {
	name: 'WangEditor',
	data() {
		return {
			editor: null,
			info_: null
		};
	},
	model: {
		prop: 'value',
		event: 'change'
	},
	props: {
		value: {
			type: String,
			default: ''
		},
		isClear: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		isClear(val) {
			// 触发清除文本域内容
			if (val) {
				this.editor.txt.clear();
				this.info_ = null;
			}
		},
		value: function(value) {
			if (value !== this.editor.txt.html()) {
				this.editor.txt.html(this.value);
			}
		}
	},
	mounted() {
		this.setEditor();
		this.editor.txt.html(this.value);
	},
	methods: {
		setEditor: function() {
			// http://192.168.2.125:8080/admin/storage/create
			this.editor = new E(this.$refs.toolbar, this.$refs.editor);
			this.editor.customConfig.uploadImgServer = '/api/blog/upload'; // 配置服务器端地址
			this.editor.customConfig.uploadImgHeaders = {}; // 自定义 header
			this.editor.customConfig.uploadFileName = 'file'; // 后端接受上传文件的参数名
			this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024; // 将图片大小限制为 2M
			this.editor.customConfig.uploadImgMaxLength = 6; // 限制一次最多上传 3 张图片
			this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间
			this.editor.customConfig.debug = true; // 设置超时时间

			// 配置菜单
			this.editor.customConfig.menus = [
				'head', // 标题
				'bold', // 粗体
				'fontSize', // 字号
				'fontName', // 字体
				'italic', // 斜体
				'underline', // 下划线
				'strikeThrough', // 删除线
				'foreColor', // 文字颜色
				'backColor', // 背景颜色
				'link', // 插入链接
				'list', // 列表
				'justify', // 对齐方式
				'quote', // 引用
				'emoticon', // 表情
				'image', // 插入图片
				'table', // 表格
				'code', // 插入代码
				'undo', // 撤销
				'redo' // 重复
			];
			this.editor.customConfig.customUploadImg = (files, insertImage) => {
				var param = new FormData();
				for (var i = 0; i < files.length; i++) {
					param.append('file', files[i]);
				}
				uploadImageToSSO(param).then(res => {
					insertImage(res.data);
				});
			};
			this.editor.customConfig.onchange = html => {
				this.info_ = html; // 绑定当前逐渐地值
				this.$emit('change', this.info_); // 将内容同步到父组件中
			};
			// 创建富文本编辑器
			this.editor.create();
		}
	}
};
</script>

<style lang="stylus">
.editor
	width 100%
	margin 0 auto
	position relative
	z-index 0
	.toolbar
		border 1px solid #ccc
	.text
		border 1px solid #ccc
		height 100%
</style>
