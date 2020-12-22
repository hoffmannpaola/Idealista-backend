const supertest = require("supertest");
const app = require("../src/app");
const db = require("../src/database");

async function cleanDB() {
    try {
        await db.query('DELETE FROM labels');
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
    it("should return status 422, invalid params", async () => {
        const body = {
            name: " "
        };

        const response = await supertest(app).post("/tasks").send(body);

        expect(response.status).toBe(422);
    });

    it("should return status 201, valid params", async () => {
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
        ));
    });
});

describe("POST /labels", () => {
    it("should return status 422, invalid params", async () => {
        const body = {
            color: "#6578"
        };

        const response = await supertest(app).post("/labels").send(body);

        expect(response.status).toBe(422);

    });

    it("should return status 201, valid params", async () => {
        const body = {
            color: "#AA0255"
        };

        const response = await supertest(app).post("/labels").send(body);

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(
            expect.objectContaining({
                color: "#AA0255"
            })
        );
    });
});

describe("GET /labels", () => {
    it('should return every labels, status 200', async () => {
        await db.query("INSERT INTO labels (color) VALUES ('#434343')");

        const response = await supertest(app).get("/labels");

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[1]).toMatchObject(
            expect.objectContaining({
                color: "#434343"
            })
        );
    });
});