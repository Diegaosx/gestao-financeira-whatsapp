import User from "./User.js"
import Contact from "./Contact.js"
import Category from "./Category.js"
import Expense from "./Expense.js"
import Budget from "./Budget.js"
import Message from "./Message.js"

// Relações
Contact.hasMany(Expense)
Expense.belongsTo(Contact)

Category.hasMany(Expense)
Expense.belongsTo(Category)

Contact.hasMany(Budget)
Budget.belongsTo(Contact)

Category.hasMany(Budget)
Budget.belongsTo(Category)

Contact.hasMany(Message)
Message.belongsTo(Contact)

// Exportar todos os modelos
export { User, Contact, Category, Expense, Budget, Message }
