import { llm } from "@chat-app/llm";
import { z } from "zod";

const reviewSchema = z.object({
    movie: z.string().describe(
        "Filmens titel."
    ),
    rating: z.number().min(1).max(5).describe(
        "Betyg mellan 1 och 5."
    ),
    sentiment: z.enum([
        "positive",
        "neutral",
        "negative"
    ]).describe(
        "Recensionens övergripande känsla."
    ),
    summary: z.string().describe(
        "En kort sammanfattning på svenska."
    )
});

const structuredLLM = llm.withStructuredOutput(reviewSchema);

export const analyzeReview = async (review) => {
    return await structuredLLM.invoke(review);
};