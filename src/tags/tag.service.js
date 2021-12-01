const config = require('config.json');
const db = require('_helpers/db');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    create,
    searchTag,
};

async function create(params) {
    const { name, desc } = params.body;
    // validate
    if (await db.Tags.findOne({ where: { name: name } })) {
        throw 'TagName "' + name + '" is already taken';
    }
    if (!params.file) {
        throw 'Need to add image';
    }
    const file = params.file;
    let imagePaths = [];
    imagePaths.push('http://localhost:4000/uploads/' + file.filename);
    const tagObject = {
        name: name,
        desc: desc,
        imgs: imagePaths
    }
    const newTag = await db.Tags.create(tagObject);
    return newTag;
}

async function updateTag() {
    
}

async function searchTag(params) {
    const tags = await db.Tags.findAndCountAll(
        {
            where: {
                name: {
                    [Op.like]: params.name === 'null' ? '%' + params.name + '%' : '%%',
                },
                desc: {
                    [Op.like]: params.desc === 'null' ? '%' + params.desc + '%' : '%%',
                }
            },
            limit: 12,
            offset: 0
        });
    return tags;
}