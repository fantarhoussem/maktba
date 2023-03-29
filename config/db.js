const { default: mongoose } = require('mongoose');
const mogoose = require('mongoose');

(
async() => {
try {
await mongoose.connect('mongodb+srv://fantarhoussem:jtnoFJqlzFF6tdZi@cluster0.spimht9.mongodb.net/maktabti?retryWrites=true&w=majority');
console.log('connexion réussie avec la base de données');

}
catch (error){

console.log(error.message);

}


}



)();