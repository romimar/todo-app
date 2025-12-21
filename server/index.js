const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      connectSrc: ["'self'", "http://localhost:8080", "ws://localhost:8080"],
    },
  },
}));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo App API',
      version: '1.0.0',
      description: 'A simple Todo application API',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server',
      },
    ],
  },
  apis: [__dirname + '/index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const items = [];

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - date
 *         - isDone
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Sample Item"
 *         description:
 *           type: string
 *           example: "Sample Description"
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2025-11-31T23:59:59.999Z"
 *         isDone:
 *           type: boolean
 *           example: false
 */

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Get all items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: List of all items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
app.get('/api/items', (req, res) => {
    const ids = items.map(i => i.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
        console.warn('WARNING: Duplicate IDs in items:', items);
    }
    res.json(items);
});

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - date
 *               - isDone
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Sample Item"
 *               description:
 *                 type: string
 *                 example: "Sample Description"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-31T23:59:59.999Z"
 *               isDone:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Item created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Title is required
 */
app.post('/api/items', (req, res) => {
    if (!req.body?.title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    const maxId = items.length > 0 ? Math.max(...items.map(i => i.id)) : 0;
    const newItem = {
        id: maxId + 1,
        title: req.body.title,
        description: req.body.description || '',
        date: req.body.date || null,
        isDone: !!req.body.isDone
    };
    items.push(newItem);
    res.status(201).json(newItem);
});

/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *     summary: Update an item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               isDone:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Item updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 */
app.put('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const itemIndex = items.findIndex(i => i.id === id);
    
    if (itemIndex === -1) {
        return res.status(404).json({ error: "Item not found" });
    }
    
    items[itemIndex] = {
        ...items[itemIndex],
        ...req.body,
        id: id
    };
    
    res.json(items[itemIndex]);
});

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Delete an item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Item deleted
 *       404:
 *         description: Item not found
 */
app.delete('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const itemIndex = items.findIndex(i => i.id === id);
    
    if (itemIndex === -1) {
        return res.status(404).json({ error: "Item not found" });
    }
    
    items.splice(itemIndex, 1);
    res.status(204).send();
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    console.log(`API Documentation available at http://localhost:${port}/api-docs`);
});