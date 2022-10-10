const { fetchTopics, fetchArcticlesById } = require("../model/model");

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send(topics)
    })
        .catch((err) => {
            next(err)
        })
}

exports.getArticlesById = (req, res, next) => {
    const id = req.params.article_id
    fetchArcticlesById(id).then((article) => {
        res.status(200).send(article)
    })
        .catch((err) => {
            next(err)
    })
}