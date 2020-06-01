var faker = require('faker');
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('./UserDatabase');
db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS UserInformation (Id int, Name string, Email string, Address string)");
    var stmt = db.prepare("INSERT INTO UserInformation VALUES (?,?,?,?)");
    for (var i = 0; i < 200; i++) {
        let id = faker.random.uuid();
        let name = faker.fake("{{name.lastName}}, {{name.firstName}} {{name.suffix}}");
        let email = faker.fake("{{internet.email}}");
        let address = faker.fake("{{address.city}}, {{address.streetName}} {{address.country}} {{address.zipCode}}");
        stmt.run(id, name, email, address);
    }
    stmt.finalize();

});
db.close((err) => {
    if (err) {
        console.log(err.message);
    }
})
console.log('DB Connection is closed');
