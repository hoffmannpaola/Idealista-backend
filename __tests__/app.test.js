const supertest = require("supertest");
const app = require("../src/app");
const agent = supertest(app);
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

let idTask;

describe("POST /tasks", () => {
    it("should return status 422, invalid params", async () => {
        const body = {
            name: " "
        };

        const response = await agent.post("/tasks").send(body);

        expect(response.status).toBe(422);
    });

    it("should return status 201, valid params", async () => {
        const body = {
            name: "Comprar pão"
        };

        const response = await agent.post("/tasks").send(body);

        expect(response.status).toBe(201);
        expect(response.body).toEqual((
            expect.objectContaining({
                name: "Comprar pão",
                isChecked: false,
                labels: []
            })
        ));
        
        idTask = response.body.id;
    });
});

describe("POST /labels", () => {
    it("should return status 422, invalid params", async () => {
        const body = {
            color: "#6578"
        };

        const response = await agent.post("/labels").send(body);

        expect(response.status).toBe(422);

    });

    it("should return status 201, valid params", async () => {
        const body = {
            color: "#AA0255"
        };

        const response = await agent.post("/labels").send(body);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(
            expect.objectContaining({
                color: "#AA0255"
            })
        );
    });
});

describe("GET /labels", () => {
    it('should return every labels, status 200', async () => {
        await db.query("INSERT INTO labels (color) VALUES ('#434343')");

        const response = await agent.get("/labels");

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[1]).toMatchObject(
            expect.objectContaining({
                color: "#434343"
            })
        );
    });
});

describe('PUT /tasks/:id', () => {
    it('should return 422, invalid params', async () => {
        const body = {
            name: true
        };
    
        const response = await agent.put(`/tasks/${idTask}`).send(body);
    
        expect(response.status).toBe(422);
    });

    it('should return 404, not found id', async () => {
        const response = await agent.put("/tasks/0");

        expect(response.status).toBe(404);
    });

    it('should return 200, OK save', async () => {
        const body = {
            isChecked: true
        }

        const response = await agent.put(`/tasks/${idTask}`).send(body);

        const updated = await db.query(`SELECT * FROM tasks WHERE id = $1`, [idTask]);
        const { id, name, isChecked} = updated.rows[0];

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                id,
                name,
                isChecked,
            })
        );
    });
});

describe("DELETE /tasks/:id", () => {
    it('should return 404, not found id', async () => {
        const response = await agent.delete("/tasks/0");

        expect(response.status).toBe(404);
    });

    it('should return 200, delete task with valid id', async () => {

        const response = await agent.delete(`/tasks/${idTask}`);

        expect(response.status).toBe(200);
    });
});