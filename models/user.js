import bcrypt from 'bcrypt';

export default( sequelize, DataTypes)=>{
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            type: DataTypes.TEXT,
            unique: true,
            allowNull: false,
            get() {
                return this.getDataValue('email').toLowerCase()
            }
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
            //cant hanlde asyn code
            // set(value) {
            //     bcrypt.hash(value, 10).then(hash => {
            //         console.log("🚀 ~ set ~ hash:", hash)
            //         this.setDataValue('password', hash)
            //     });
            // }
        },
        age: DataTypes.REAL
    }, {
        timestamps: true,
        paranoid: true //for soft delete, will add a column deletedAt
        // Every query performed by Sequelize will automatically ignore soft-deleted records
    })
    // ✅ Hash password before saving to database
    User.beforeCreate(async (user) => {
        if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
        }
    });
    User.associate = (models => {
        console.log("🚀 association")
        User.hasOne(models.Profile, { foreignKey: 'user_id' })
    })
    return User;
}

//user to profile will be one to one relationship with fk(profile) not null.
//user to company-car will be one to one relationship with fk(car) nullable.
// The save() instance method is not aware of associations. In other words, if you change a value from a child object that was eager loaded along a parent object, calling save() on the parent will completely ignore the change that happened on the child.