import express, { Request, Response } from 'express';
const app = express();

app.use(express.json());

app.get('/currencies', async (req: Request, res: Response) => {
    res.json({
        usd: 3 + Math.random()
    });
});

app.listen(3001, () => {
    console.log('Listening at port 3001...');
});
