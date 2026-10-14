// CODE MOVED TO API ROUTE TO PROTECT PRIVATE KEYS LIKE GEMINI_API_KEY

// import { Task } from "@/app/components/TaskList";
// import { GoogleGenAI } from "@google/genai";
// import { z } from "zod";

// const ai_client = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// const chatIds: string[] = [];

// type ExtractResult = {
//   success: boolean;
//   data: Record<string, string | null> | null;
//   error?: string;
// };

// function buildSchema(attributes: string[]) {
//   const properties = Object.fromEntries(
//     attributes.map((attr) => [
//       attr,
//       {
//         type: ["string", "null"],
//         description: `Extract the ${attr} from the user's message. Use null if it is missing.`,
//       },
//     ])
//   );

//   return {
//     type: "object",
//     properties: {
//       success: {
//         type: "boolean",
//         description: "True when the extraction succeeded.",
//       },
//       data: {
//         type: "object",
//         properties,
//         required: attributes,
//         additionalProperties: false,
//       },
//       intent: {
//         type: z.enum(["edit_previous", "new"]),
//         description: "new by default",
//       },
//     },
//     required: ["success", "data"],
//     additionalProperties: false,
//   } as const;
// }
// export async function handleChat(message: string) {
//   const extractedData = (await extractAttributesFromContent(
//     message,
//     [
//       "title",
//       "category",
//       "priority",
//       "dueDate",
//       "reminderTime",
//       "status",
//       "description",
//     ],
//     process.env.GEMINI_MODEL
//   )) as any;
//   const { title, ...taskData } = extractedData?.data;
//   const create = await createTask(extractedData.intent, {
//     ...taskData,
//     title: title ?? message,
//   });
//   return { data: { ...extractedData, title: title ?? message }, success: true };
// }

// export async function extractAttributesFromContent(
//   content: string,
//   attributes: string[],
//   model = "gemini-3-flash-preview"
// ): Promise<ExtractResult> {
//   try {
//     // const response = await ai_client.models.generateContent({
//     //   model,
//     //   contents: content,
//     //   config: {
//     //     systemInstruction:
//     //       "You extract structured data from user messages. " +
//     //       "Return only the requested fields. " +
//     //       "If a field is missing, return null for that field.",
//     //     responseMimeType: "application/json",
//     //     responseJsonSchema: buildSchema(attributes),
//     //   },
//     // });

//     // const text= response.text;

//     const response = await ai_client.interactions.create({
//       model,
//       input: [
//         {
//           role: "user",
//           content,
//         },
//       ],
//       previous_interaction_id: chatIds.pop(),
//       system_instruction:
//         "You extract structured data from user messages. " +
//         "Return only the requested fields. " +
//         "If a field is missing, return null for that field.",
//       response_mime_type: "application/json",
//       response_format: buildSchema(attributes),
//     });

//     console.log("\n\n@here response🤖", response, chatIds, "\n");
//     const outputs = response.outputs;
//     const lastOutput = outputs?.pop();
//     const text = lastOutput?.type == "text" ? lastOutput.text : "";
//     chatIds.push(response.id);

//     // ??response
//     //   ? response.outputs[response.outputs.length - 1].text
//     //   : "";

//     const parsed = JSON.parse(text ?? "{}") as {
//       success?: boolean;
//       data?: Record<string, string | null>;
//       intent?: "new" | "edit_previous";
//     };
//     console.log("@here parsed", parsed);
//     return {
//       success: true,
//       data: parsed.data ?? null,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       data: null,
//       error: error instanceof Error ? error.message : "Unknown error",
//     };
//   }
// }

// export async function createTask(intent: string, data: Task) {
//   const taskCreate = fetch("/api/task", {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
//   return taskCreate;
// }
