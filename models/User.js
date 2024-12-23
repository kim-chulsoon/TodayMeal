module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        field: "user_id",
      },
      userPw: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: "user_pw",
      },
      name: {
        type: DataTypes.STRING(20),
      },
      birthdate: {
        type: DataTypes.DATEONLY,
      },
      profileImage: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "/static/img/icons/profile.png", // 기본 이미지 설정
        field: "profile_image",
      },
    },
    {
      tableName: "User", // 테이블명 지정
      timestamps: true,
    },
  );

  return User;
};
