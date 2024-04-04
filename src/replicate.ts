import Replicate, { Prediction } from 'replicate';

import { Context } from 'hono';

interface Input {
	prompt: string;
	scheduler: string;
}

async function handler(c: Context) {
	const replicate = new Replicate({
		auth: c.env.REPLICATE_API_TOKEN,
	});

	if (!process.env.REPLICATE_API_TOKEN) {
		return c.json({ message: 'REPLICATE_API_TOKEN not found', ok: false }, 500);
	}

	const input: Input = await c.req.json();
	const { prompt, scheduler } = input;

	const prediction = await replicate.predictions.create({
		version: 'ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4',
		input: {
			prompt: prompt,
			scheduler: scheduler,
		},
	});

	if (prediction?.error) {
		return c.json({ message: prediction.error, ok: false }, 500);
	}

	let latest: Prediction;
	let completed: boolean = false;

	while (!completed) {
		const checker = await replicate.predictions.get(prediction.id);
		if (checker.status !== 'starting' && checker.status !== 'processing') {
			latest = checker;
			return c.json({ message: 'Success', ok: true, data: latest }, 200);
		} else {
			await new Promise((r) => setTimeout(r, 2000));
		}
	}
}

export { handler as replicateHandler };
