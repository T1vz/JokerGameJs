const {Router} = require('express')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/user')

const router = Router()

router.post('/register', 
[
    check('email', 'Некоректный email').isEmail(),
    check('password', 'Минимальная длинна пароля 6 символов')
        .isLength({min:6})
],
 async(req, res) =>{
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty() || req.body.username === ''){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некоректны данные при регистрации'
            })
        }
        const {email, password, username} = req.body
        const candidateE = await User.findOne({email})
        const candidateU = await User.findOne({username})

        if (candidateE){
            return res.status(400).json({message: 'Такой Email уже занят'})
        }
        if (candidateU){
            return res.status(400).json({message: 'Такое имя пользователя уже существует'})
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({email, password: hashedPassword, username})


        await user.save()

        res.status(201).json({message: 'Пользователь создан'})

    } catch (e) {
        res.status(500).json({message:'Что-то пошло не так ...'})
    }

})

router.post('/login',
    [
    check('email', 'Некоректный email').isEmail(),
    check('password', 'Введите пароль').exists()
    ], async(req, res) =>{
    try {
            const errors = validationResult(req)

            if (!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некоректны данные при входе в систему'
                })
            }

            const {email, password} = req.body

            const user = await User.findOne({ email })

            if (!user){
                return res.status(400).json({message: 'Пользователь не найден'})
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch){
                return res.status(400).json({message: 'Неверный пароль или email'})
            }

            const token = jwt.sign(
                { userId:user.id },
                config.get('jwtSecret'),
                {expiresIn: '365d'}
            )

            res.json({token, userId:user.id, username:user.username})

        
    } catch (e) {
        res.status(500).json({message:'Что-то пошло не так ...'})
        console.log(e.message);
    }
})

module.exports = router