import { Router } from "express";
import db from "../models/index.js"
import { Op, where } from "sequelize";
import Profile from "../models/profile.js";
const { sequelize } = db
let router = Router()
router.get('/getAll', async (req, res) => {
    console.log("get all")
    // const users = await db.User.findAll({ attributes: ['email', 'age'], order: [['age', 'ASC']] });
    const users = await userWithProfiles()
    // const users = await db.User.findAll({ attributes: ['email','age'],order: [sequelize.fn('max',sequelize.col('age'))] });
    res.status(200).json({ success: true, users })
})
router.get('/find-user', async (req, res) => {
    console.log("get all")

    const users = await weekPsw()
    res.status(200).json({ success: true, users })
})
router.get('/delete', async (req, res) => {
    console.log("get all")

    const users = await destory()
    res.status(200).json({ success: true, users })
})
router.get('/update', async (req, res) => {
    console.log("get all")

    const users = await addAge()
    res.status(200).json({ success: true, users })
})
router.get('/getCountUser', async (req, res) => {
    console.log("get count")
    const users = await db.User.findAll({ attributes: [[sequelize.fn('COUNT', sequelize.col('email')), 'count']] });
    res.status(200).json({ success: true, users: JSON.stringify(users, null, 2) })
})
// router.get('/getCountUser', async (req, res) => {
//     console.log("get count")
//     const users = await db.User.findAll({ attributes: { 
//         include: [[sequelize.fn('COUNT',sequelize.col('email')),'count']] } });
//     res.status(200).json({ success: true, users: JSON.stringify(users, null, 2) })
// })
router.get('/add', async (req, res) => {
    try {
        console.log("🚀 ~ router.get ~ req:", req.query)
        const { email, age, pass,gender,exp } = req.query
        const user = await db.User.create({ email: email, password: pass, age })
        //create profile
        // const profile = await db.Profile.create({gender,exp})
        // db.User.addProfile(profile)
        const userP = await user.createProfile({gender,exp})
        res.status(200).json({ success: true, userP })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false })

    }
})
router.get('/bulk', async (req, res) => {
    try {
        console.log("🚀 ~ router.get ~ req:", req.query)
        const users = await bulkCreate()
        res.status(200).json({ success: true, users })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false })

    }
})
async function weekPsw() {
    return await db.User.findAll({ where: sequelize.where(sequelize.fn('char_length', sequelize.col('password')), { [Op.lte]: 4 }) })
}
async function findQuery() {
    const users = await db.User.findAll({
        where: {
            age: {
                [Op.between]: [2, 22]
            },
            email: {
                [Op.like]: '%haha'
            }
        }, attributes: ['email', 'age']
    })
}
async function addAge() {
    return await db.User.update({ age: 1 }, {
        where: {
            age: {
                [Op.is]: null
            }
        }, attributes: ['email', 'age']
    })
}
async function destory() {
    return await db.User.destroy({
        where: {
            age: {
                [Op.lt]: 2
            }
        }, attributes: ['email', 'age']
    })
}
async function bulkCreate() {
    //copy paste
    return await db.User.bulkCreate([{ email: 'foo' }, { email: 'bar', admin: true }], {
        fields: ['email'], validate: true
    });
}

// findAll
// findByPk
// findOne
// findOrCreate
// findAndCountAll
async function restore() {
    // Restoring every soft-deleted post with more than 100 likes
    await Post.restore({
        where: {
            likes: {
                [Op.gt]: 100,
            },
        },
    });

    await Post.findByPk(123, { paranoid: false });
}
function join() {
    db.User.findAll({

    },
        {
            where: {
                "$Task.deleted$":{[Op.ne]:null}
            },
            include: {
                model: Task,
                required: true,//only fetch records with fk
                where: { //filter fk
                    size: {
                        [Op.in]: [1, 2]
                    }
                }
            },
        })
}
async function userWithProfiles(){
   return await db.User.findAll({include:{
        model:db.Profile,
        attributes:['gender','exp'],
        required:true//true =>inner join default is left join
    }})
}
export default router