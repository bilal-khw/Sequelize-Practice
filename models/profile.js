export default (sequelize, DataTypes) => {

    const Profile = sequelize.define('Profile', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        gender: DataTypes.STRING,
        exp: DataTypes.INTEGER,
        // user_id: {
        //     type: DataTypes.UUID,
        //     references: {
        //         model: User,
        //         key: "id",
        //         deferrable: Deferrable.INITIALLY_IMMEDIATE
        //     }
        // }
    }, {
        timestamps: true,
        paranoid: true //for soft delete, will add a column deletedAt
        // Every query performed by Sequelize will automatically ignore soft-deleted records
    })
    Profile.associate = (models => {
        Profile.belongsTo(models.User, { foreignKey: 'user_id' })
    })
    return Profile;
}