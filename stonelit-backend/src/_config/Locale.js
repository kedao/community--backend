import {setLocale} from "yup";

export const initLocale = () => {
    setLocale({
        mixed: {
            required: '请输入信息',
            notType: function notType(_ref) {
                switch (_ref.type) {
                    case 'number':
                        return '请输入有效的数字';
                    case 'string':
                        return '请输入有效的字符串';
                    default:
                        return 'Wrong type error or any other custom error message';
                }
            }
        },
        string: {
            required: 'Deve ser maior que '
        }
    });
}
