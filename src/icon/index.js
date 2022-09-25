/**
 * 思考：
 * 之前做过svg图标的批量引入，现在要在新的项目中用到，一时忘了应该怎么做，证明之前并没有自己的思考，就像听课只是听懂了，并没有消化
 *
 * @see https://rambler1501719577.gitee.io/blog/
 */
import { batchImport } from '@/utils'
import Icon from './Icon'

batchImport(require.context('./svg', true, /\.svg$/))
export default Icon
