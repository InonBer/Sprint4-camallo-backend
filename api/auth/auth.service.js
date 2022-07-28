const Cryptr = require('cryptr')
const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')
const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

async function login(fullname, password) {
    logger.debug(`auth.service - login with fullname: ${fullname}`)

    const user = await userService.getByUsername(fullname)
    if (!user) return Promise.reject('Invalid fullname or password')
    // TODO: un-comment for real login
    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid fullname or password')

    delete user.password
    user._id = user._id.toString()
    console.log(user);
    return user
}

// (async ()=>{
//     await signup('bubu', '123', 'Bubu Bi')
//     await signup('mumu', '123', 'Mumu Maha')
// })()


async function signup({ password, fullname, email }) {
    const saltRounds = 10

    logger.debug(`auth.service - signup with email: ${email}, fullname: ${fullname}`)
    if (!email || !password || !fullname) return Promise.reject('Missing required signup information')

    const userExist = await userService.getByUsername(fullname)
    if (userExist) return Promise.reject('fullname already taken')

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ password: hash, fullname, email })
}


function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser

    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}


module.exports = {
    signup,
    login,
    getLoginToken,
    validateToken
}