const { fetchTopics } = require('../model/model')

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        console.log(topics)
        res.status(200).send(topics)
    })
        .catch((err) => {
            console.log(err)
            next(err)
        })
    
}