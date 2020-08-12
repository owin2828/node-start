const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { User } = require('../models');

/*
 * Passport 모듈 설정 파일
 *
 * 로그인한 유저의 id를 세션에 저장하는 부분과
 * 저장한 유저의 id를 기반으로 DB에서 정보를 조회하여 req.user에 저장하는 부분으로 구성
 * 전체적인 흐름은 다음과 같다
 * 
 * ## 1. 유저가 로그인 하기까지 
 * 1-1. 로그인 요청이 들어옴
 * 1-2. passport.authenticate 매서드 호출
 * 1-3. 로그인 전략 수행
 * 1-4. 로그인 성공 시, 사용자 정보 객체와 함께 req.login 호출
 * 1-5. req.login 매서드가 passport.serializeUser 호출
 * 1-6. req.session에 사용자 아이디만 저장
 * 1-7. 로그인 완료
 * 
 * ## 2. 로그인 이후의 과정
 * 2-1. 모든 요청에 passport.session() 미들웨어가 passport.deserializeUser 매서드 호출
 * 2-2. req.session에 저장된 아이디로 DB에서 사용자 조회
 * 2-3. 조회된 사용자 정보를 req.user에 저장
 * 2-4. 라우터에서 req.user 객체 사용 가능
 */
module.exports = (passport) => {
    /*
     * 사용자 정보 객체를 세션에 아이디로 저장
     * 매개변수 user에 로그인 사용자 정보가 담기고,
     * done에 두번째 인자로 id를 넘김 (첫 번째는 err 처리, 두 번째가 중요)
     */
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    /*
     * 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러옴
     * 위에서 세션에 저장한 id를 받아 DB에서 사용자 정보를 조회
     * 조회한 정보는 req.user에 저장하므로, 앞으로 사용자 정보는 req.user를 통해 조회
     * 
     * + 팔로잉, 팔로워 관계가 생겼으므로 해당하는 부분의 목록을 같이 조회
     */
    passport.deserializeUser((id, done) => {
        User.findOne({ 
            where: { id },
            include: [{
                model: User,
                attributes: ['id', 'nick'], // attributes를 지정해서 가져오는 이유는, 실수로 비밀번호흫 조회하지 않도록 방지
                as: 'Followers',
            }, {
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followings'
            }], 
        })
            .then(user => done(null, user /* <- req.user에 저장 */)) 
            .catch(err => done(err));
    });

    local(passport);
    kakao(passport);
};