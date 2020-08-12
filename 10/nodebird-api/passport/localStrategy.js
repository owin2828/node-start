const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

/*
 * passport-local에서 strategy 생성자를 불러와 사용하여 로그인 전략을 구현
 * 
 * 크게 2가지 인자 부분으로 나뉨
 * 
 * 1. LocalStrategy의 첫번째 인자 - 전략에 관한 설정을 하는 부분
 *    req.body에 id와 pw 설정 부분을 가져와 매칭
 * 
 * 2. LocalStrategy의 두번째 인자 - 실제 전략을 수행하는 async 함수
 *    1번에서 넣어준 email, password가 이 함수의 인자로 들어감
 *    3번째 인자 done은 passport.authenticate의 콜백 함수
 */
module.exports = (passport) => {
    // 1번 부분
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, /* 2번 부분 */ async(email, password, done) => {
        try{
            /*
             * done 함수의 첫번째 인자를 사용하는 경우: 서버쪽 에러 발생 시
             * done 함수의 세번째 인자를 사용하는 경우: 
             * 로그인 처리과정에서 비밀번호가 일치하지 않거나, 없는 회원일 경우 등의 사용자 정의 에러 발생 시
             */
            const exUser = await User.findOne({ where: { email } });
            if(exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                if(result){
                    done(null, exUser);
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.'});
            }
        } catch(error){
            console.error(error);
            done(error);
        }
    }));
};