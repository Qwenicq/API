// 导入数据库操作模块
const { result } = require('@hapi/joi/lib/base')
const db = require('../db/index')
const bcrypt = require('bcryptjs')

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
    // 定义查询用户信息的 SQL 语句
    const sql = `select id,username,nickname,email,user_pic from ev_users where id=?`
    // 调用 db.query()
    db.query(sql, req.user.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询结果不能为空
        if (results.length !== 1) return res.cc('获取用户信息失败')
        
        // 用户信息获取成功
        res.send({
            status: 0,
            message: '获取用户信息成功!',
            data:results[0]
        })
    })
}

// 更新用户基本信息的基本函数
exports.updateUserInfo = (req, res) => {
    // 定义待执行的 SQL 语句
    const sql = `update ev_users set ? where id=?`

    db.query(sql, [req.body, req.body.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更新用户的基本信息失败!')
        res.cc('更新用户信息成功!', 0)
    })
}

// 更新用户密码的处理函数
exports.updatePassword = (req, res) => {
    // 根据id查询用户的信息
    const sql = `select * from ev_users where id=?`
    // 执行根据id查询用户的信息
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (result.length !== 1) return res.cc('用户不存在')
        
        //  判断旧密码是否正确
       const compareResults =  bcrypt.compareSync(req.body.oldPwd,results[0].password)
        if (!compareResults) return res.cc('旧密码错误！')
        
        // 更新数据库的数据
        const sql = `update ev_users set password=? where id=?`
        // 对新密码进行加密处理
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        db.query(sql, [newPwd, req.user.id], (err,results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新密码失败!')
            res.cc('更新密码成功！',0)
        })
    })
}

// 更新用户头像
exports.updateAvatar = (req, res) => {
    const sql = `update ev_users set user_pic=? where id=?`
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows != 1) res.cc('更新头像失败')
        res.cc('更新头像成功',0)
    })
}