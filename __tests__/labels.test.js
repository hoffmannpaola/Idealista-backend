const supertest = require("supertest");
const app = require("../src/app");
const db = require("../src/database");

async function cleanDB() {
    try {
        await db.query('DELETE FROM labels');

    } catch(error) {
        console.log(error);
    }
}

beforeAll(cleanDB);

afterAll(async () => {
    await cleanDB();
    db.end();
})



describe("POST /labels", () => {

    it("It should return status 422, invalid params", async () => {
        const body = {
            color: "#6578"
        };

        const response = await supertest(app).post("/labels").send(body);

        expect(response.status).toBe(422);

    });

    it("It should return status 201, valid params", async () => {
        const body = {
            color: "#AA0255"
        };

        const response = await supertest(app).post("/labels").send(body);

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject((
            expect.objectContaining({
                color: "#AA0255"
            })
        ))
    });
});