import { llm } from "@chat-app/llm";
import { getMovies, getShowtimes, createBooking, searchWeb } from "@chat-app/tools";
import { ToolMessage } from "@langchain/core/messages";
import { messagePrompt } from "@chat-app/prompts";

// Våra tillgängliga verktyg
const tools = [getMovies, getShowtimes, createBooking, searchWeb];

// Koppla verktygen till modellen
const llmWithTools = llm.bindTools(tools);

// Skapa vår kedja
const chain = messagePrompt.pipe(llmWithTools);

export const invokeAssistant = async (history, question) => {
    const messages = await messagePrompt.formatMessages({
        history,
        question
    });

    // Här spara vi ned en eventuell bokning
    let booking = null;

    for(let i = 0; i < 5; i++) {
        const response = i === 0
            ? await chain.invoke({ history, question })
            : await llmWithTools.invoke(messages);

        console.log('CONTENT', response.content);
        console.log('TOOL CALLS', response.tool_calls);

        messages.push(response);

        // Om modellen inte vill använda något verktyg
        // returnerar vi svaret till vår useChat
        if(!response.tool_calls?.length) {
            return {
                content : response.content,
                booking
            }
        }
    
        // Kör verktygen som modellen har valt ut
        for(const toolCall of response.tool_calls) {
            const selectedTool = tools.find(
                tool => tool.name === toolCall.name
            );

            if(!selectedTool) {
                throw new Error(
                    `Verktyget ${toolCall.name} hittades inte.`
                )
            }

            const result = await selectedTool.invoke(toolCall.args);
            console.log('TOOL RESULT', JSON.parse(result));

            if(toolCall.name === 'create_booking') {
                const data = typeof result === 'string'
                    ? JSON.parse(result)
                    : result;
                
                if(data.success) {
                    booking = data.booking;
                }
            }

            // Skicka vertygets resultat tillbaks till modellen
            messages.push(
                new ToolMessage({
                    content : typeof result === 'string'
                        ? result
                        : JSON.stringify(result),
                    tool_call_id : toolCall.id
                })
            );
        }
    }
}