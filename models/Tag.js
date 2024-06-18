import { DataTypes } from 'sequelize'
import sequelize  from '../dbConnection.js'

const Tag = sequelize.define('Tag',{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    }
},{
    timestamps: false
})

export default Tag