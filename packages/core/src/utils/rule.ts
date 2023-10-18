import { type Rule } from 'antd/es/form'
export namespace RuleUtil {
    export const required = (name = '字段'): Rule => {
        return {
            required: true,
            message: `${name}不能为空`,
        }
    }

    export const regex = (regex: RegExp, name = '格式'): Rule => {
        return {
            pattern: regex,
            message: `请输入正确的${name}`,
        }
    }

    export const email = (): Rule => {
        return {
            type: 'email',
            message: '请输入正确的邮箱格式',
        }
    }

    export const phone = (): Rule => {
        return regex(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, '手机号')
    }

    export const socialCreditCode = (): Rule => {
        return regex(/^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/, '企业统一社会信用代码')
    }

    export const ip = () => {
        return regex(/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/, 'IP')
    }

    // ip+domain ? :port
    export const domain = () => {
        return regex(
            /^(https?:\/\/)?([a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+)(:\d{1,5})?$/,
            'IP或域名格式,如www.xxx.com:80,192.168.1.1'
        )
    }

    // 中文 + 字母 + 数字 + -_
    export const commonChars = (name = '格式') => {
        return regex(
            /^[A-z0-9\u4e00-\u9fa5\-_]+([\s\.]*[A-z0-9\u4e00-\u9fa5\-_]+)*$/,
            `${name},只允许中文、字符、数字、空格、小数点或下划线（不能空格开头或结尾）`
        )
    }

    export const strictCommonChars = (name = '格式') => {
        return regex(
            /^[A-z\u4e00-\u9fa5]+([\s]*[A-z\u4e00-\u9fa5]+)*$/,
            `${name},只允许中文、字符、空格（不能空格开头或结尾）`
        )
    }

    export const length = (name = '', max = 10) => {
        return {
            min: 0,
            max,
            message: `${name}不能超过${max}个字符`,
        }
    }
}
