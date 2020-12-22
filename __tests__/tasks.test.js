const supertest = require("supertest");
const app = require("../src/app");
const db = require("../src/database");

async function cleanDB() {
    try {
        await db.query('DELETE FROM tasks');

    } catch(error) {
        console.log(error);
    }
}

beforeAll(cleanDB);

afterAll(async () => {
    await cleanDB();
    db.end();
})



describe("POST /tasks", () => {

    it("It should return status 422, invalid params", async () => {
        const body = {
            name: " "
        };

        const response = await supertest(app).post("/tasks").send(body);

        expect(response.status).toBe(422);

    });

    it("It should return status 201, valid params", async () => {
        const body = {
            name: "Comprar pão"
        };

        const response = await supertest(app).post("/tasks").send(body);

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject((
            expect.objectContaining({
                name: "Comprar pão",
                isChecked: false,
                labels: []
            })
        ))
    });
});