import {
    ChatPromptTemplate,
    MessagesPlaceholder
} from "@langchain/core/prompts";

export const messagePrompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        `
        Du är en trevlig och kunnig biografvärd.
        `
    ],
    new MessagesPlaceholder("history"),
    [
        "human",
        "{question}"
    ]
]);