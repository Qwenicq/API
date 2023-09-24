// 导入定义验证规则的包
const joi = require('joi')

// 定义 name 和 alias .验证规则
const name = joi.string().required()
const alias = joi.string().alphanum().required()

// 定义id的验证规则
const id= joi.number().integer().min(1).required()

//向外共享验证规则
exports.add_cate_schema = {
    body: {
        name,
        alias,
    }
}

// 校验规则对象 - 删除分类
exports.delete_cate_schema = {
   params: {
        id,
    }
}