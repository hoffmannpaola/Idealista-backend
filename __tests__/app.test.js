const supertest = require("supertest");
const app = require("../src/app");
const agent = supertest(app);
const db = require("../src/database");

async function cleanDB() {
    try {
        await db.query('DELETE FROM "tasksLabels"');
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

let taskId;
let firstLabelId;
let secondLabelId;

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
        
        taskId = response.body.id;
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

        firstLabelId = response.body.id;
    });
});

describe("GET /labels", () => {
    it('should return every labels, status 200', async () => {
        await db.query("INSERT INTO labels (color) VALUES ($1)", ['#434343']);

        const response = await agent.get("/labels");

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[1]).toEqual(
            expect.objectContaining({
                color: "#434343"
            })
        );

        secondLabelId = response.body[1].id;
    });
});

describe('PUT /tasks/:id', () => {
    it('should return 422, invalid params', async () => {
        const body = {
            name: true
        };
    
        const response = await agent.put(`/tasks/${taskId}`).send(body);
    
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

        const response = await agent.put(`/tasks/${taskId}`).send(body);

        const updated = await db.query(`SELECT * FROM tasks WHERE id = $1`, [taskId]);
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

describe('POST /tasks/:taskId/labels/:labelId', () => {
    it('should return 404, not found taskId', async () => {
        const response = await agent.post(`/tasks/0/labels/${firstLabelId}`);

        expect(response.status).toBe(404);
    });

    it('should return 404, not found labelId', async () => {
        const response = await agent.post(`/tasks/${taskId}/labels/0`);

        expect(response.status).toBe(404);
    });

    it('should return labels in the task and status 200 with valid ids', async () => {
        await db.query('INSERT INTO "tasksLabels" ("labelId", "taskId") VALUES ($1, $2)', [firstLabelId, taskId]);
        const response = await agent.post(`/tasks/${taskId}/labels/${secondLabelId}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[1]).toEqual(
            expect.objectContaining({
                color: "#434343"
            })
        );
    });

    it('should return 200 and the list, but the label exist', async () => {
        const response = await agent.post(`/tasks/${taskId}/labels/${secondLabelId}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]).toEqual(
            expect.objectContaining({
                color: "#AA0255"
            })
        );
    });
});

/*describe("DELETE /tasks/:id", () => {
    it('should return 404, not found id', async () => {
        const response = await agent.delete("/tasks/0");

        expect(response.status).toBe(404);
    });

    it('should return 200, delete task with valid id', async () => {

        const response = await agent.delete(`/tasks/${taskId}`);

        expect(response.status).toBe(200);
    });
});*/