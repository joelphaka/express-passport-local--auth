
exports.up = (knex, Promise) => {
    Promise.all([
        knex.schema.createTableIfNotExists('users', (table) => {
            table.increments().primary();
            table.string('email', 100).notNull().unique();
            table.string('password', 60).notNull();
            table.string('username', 32).notNull().unique();
            table.string('first_name', 32).notNull();
            table.string('last_name', 32).notNull();
            table.timestamps();
        })
    ]);
};

exports.down = (knex, Promise) => {
    Promise.all([
        knex.schema.dropTableIfExists('users')
    ]);
};
