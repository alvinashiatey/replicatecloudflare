import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { replicateHandler } from './replicate';

export type Env = {
	REPLICATE_API_TOKEN: string;
};

const app = new Hono<{ Bindings: Env }>();

app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404));
app.post('/replicate', cors(), replicateHandler);

export default app;
