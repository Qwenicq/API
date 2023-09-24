// 获取文章分类表数据的处理函数
const db = require('../db/index')
exports.getArtCates = (req, res) => {
    const sql = `select * from ev_article_cate where is_delete=0 order by id asc`
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取文章分类数据成功',
            data:results
        })
    })
}

exports.addArticleCates = (req, res) => {
    const sql = `select * from ev_article_cate where name=? or alias=?`
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err)
        // 判断数据 length
        if (results.length === 2) return res.cc('分类名称和分类别名被占用，请更新后重试')
        // lenth === 1 的三种情况
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) {
            return res.cc('分类名称和分类别名被占用，请更新后重试')
        }   
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试')

        // 分类名称和分类别名都可用，执行添加的动作
        const sql = ' insert into ev_article_cate set ?'
        db.query(sql, req.body, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('新增文章分类失败')
            res.cc('新增文章分类成功',0)
        })
    })
        
}

// 删除文章分类的函数
exports.deleteCateById=(req, res)=>{
    const sql = `update ev_article_cate set is_delete=1 where id=?`
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('删除失败')
        res.cc('已删除',0)
    })
}