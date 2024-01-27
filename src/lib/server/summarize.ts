import { LLM_SUMMERIZATION } from "$env/static/private";
import { generateFromDefaultEndpoint } from "$lib/server/generateFromDefaultEndpoint";
import type { Message } from "$lib/types/Message";

export async function summarize(prompt: string) {
	if (!LLM_SUMMERIZATION) {
		return prompt.split(/\s+/g).slice(0, 5).join(" ");
	}

	const messages: Array<Omit<Message, "id">> = [
		{ from: "user", content: "Hvem er præsidenten i Gabon?" },
		{ from: "assistant", content: "🇬🇦 Præsidenten i Gabon" },
		{ from: "user", content: "Hvem er Julien Chaumond?" },
		{ from: "assistant", content: "🧑 Julien Chaumond" },
		{ from: "user", content: "Hvad er 1 + 1?" },
		{ from: "assistant", content: "🔢 Simpel matematisk operation" },
		{ from: "user", content: "Hvad er de seneste nyheder?" },
		{ from: "assistant", content: "📰 Seneste nyheder" },
		{ from: "user", content: "Hvordan laver man en god cheesecake?" },
		{ from: "assistant", content: "🍰 Cheesecake opskrift" },
		{ from: "user", content: "Hvad er din yndlingsfilm? Giv et kort svar." },
		{ from: "assistant", content: "🎥 Yndlingsfilm" },
		{ from: "user", content: "Forklar konceptet kunstig intelligens i en sætning" },
		{ from: "assistant", content: "🤖 AI definition" },
		{ from: "user", content: prompt },
	];

	return await generateFromDefaultEndpoint({
		messages,
		preprompt: `Du er en opsummerende AI. Du vil aldrig besvare en brugers spørgsmål direkte, men i stedet opsummere brugerens forespørgsel til en enkelt kort sætning på fire ord eller mindre. Start altid dit svar med en emoji, der er relevant for opsummeringen.`,
	})
		.then((summary) => {
			// add an emoji if none is found in the first three characters
			if (!/\p{Emoji}/u.test(summary.slice(0, 3))) {
				return "💬 " + summary;
			}
			return summary;
		})
		.catch((e) => {
			console.error(e);
			return null;
		});
}
