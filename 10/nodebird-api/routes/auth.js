const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser){
            req.flash('joinError', '이미 가입된 이메일 입니다.');
            return res.redirect('/join');
        }

        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error); 
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {

    /* 
     * passport.authenticate('local') 미들웨어가 로컬 로그인 전략을 수행
     * 미들웨어인데, 라우터 미들웨어 안에 들어있다.
     * 미들웨어에 사용자 기능을 추가하고 싶을 때, 보통 이런 방식으로 함
     * 이런 경우, 내부 미들웨어에 (req, res, next)를 인자로 제공해서 호출
     */
    passport.authenticate('local', (authError, user, info) => {
        if(authError) {
            console.error(authError);
            return next(authError);
        }
        if(!User){
            req.flash('logginError', info.message);
            return res.redirect('/');
        }

        // req.login은 passport.serializeUser를 호출
        return req.login(user, (loginError) => {
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
})

module.exports = router;