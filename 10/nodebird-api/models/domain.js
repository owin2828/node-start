module.exports = (sequelize, DataTypes) => (
    sequelize.define('domain', {
        // 인터넷 주소
        host: {
            type: DataTypes.STRING(80),
            allowNull: false,
        },
        // 도메인 종류
        type: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        // API 를 사용할 때 필요한 비밀 키
        clientSecret: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
    }, {
        // 데이터를 추가로 검증하는 속성
        validate: {
            // unknown이라는 이름의 검증기 생성, 종류로 무료나 프리미엄 둘중 하나만
            unknownType() {
                console.log(this.type, this.type !== 'free', this.type !== 'premium');
                if(this.type !== 'free' && this.type !== 'premium') {
                    throw new Error('type 컬럼은 free나 premium이어야 합니다.');
                }
            },
        },
        timestamps: true,
        paranoid: true,
    })
);