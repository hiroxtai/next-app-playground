import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { convertToModelMessagesMock, openaiMock, streamTextMock } = vi.hoisted(
  () => ({
    convertToModelMessagesMock: vi.fn(),
    openaiMock: vi.fn(),
    streamTextMock: vi.fn(),
  }),
);

vi.mock("ai", () => ({
  convertToModelMessages: convertToModelMessagesMock,
  streamText: streamTextMock,
}));

vi.mock("@ai-sdk/openai", () => ({
  openai: openaiMock,
}));

import { POST } from "./route";

const validRequestBody = {
  messages: [
    {
      id: "message-1",
      role: "user" as const,
      parts: [{ type: "text", text: "こんにちは" }],
    },
  ],
};

const originalOpenAiApiKey = process.env.OPENAI_API_KEY;

function createJsonRequest(options?: {
  body?: unknown;
  headers?: Record<string, string>;
}) {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: JSON.stringify(options?.body ?? validRequestBody),
  });
}

async function readError(response: Response) {
  const payload = (await response.json()) as {
    error: {
      code: string;
      message: string;
      details?: unknown;
    };
  };

  return payload.error;
}

describe("POST /api/chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.OPENAI_API_KEY = "test-api-key";

    openaiMock.mockReturnValue("mock-model");
    convertToModelMessagesMock.mockResolvedValue([
      { role: "user", content: [{ type: "text", text: "こんにちは" }] },
    ]);
    streamTextMock.mockReturnValue({
      toUIMessageStreamResponse: () =>
        new Response("streaming", { status: 200 }),
    });
  });

  afterEach(() => {
    if (originalOpenAiApiKey === undefined) {
      delete process.env.OPENAI_API_KEY;
      return;
    }

    process.env.OPENAI_API_KEY = originalOpenAiApiKey;
  });

  it("returns 500 when OPENAI_API_KEY is not configured", async () => {
    delete process.env.OPENAI_API_KEY;

    const response = await POST(
      createJsonRequest({
        headers: { "x-forwarded-for": "198.51.100.1" },
      }),
    );
    const error = await readError(response);

    expect(response.status).toBe(500);
    expect(response.headers.get("Content-Type")).toContain("application/json");
    expect(error.code).toBe("server_configuration_error");
    expect(streamTextMock).not.toHaveBeenCalled();
  });

  it("returns 400 when request body is invalid JSON", async () => {
    const request = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "198.51.100.2",
      },
      body: "{ invalid-json",
    });

    const response = await POST(request);
    const error = await readError(response);

    expect(response.status).toBe(400);
    expect(error.code).toBe("invalid_json");
    expect(streamTextMock).not.toHaveBeenCalled();
  });

  it("returns 400 when payload shape does not satisfy validation", async () => {
    const response = await POST(
      createJsonRequest({
        headers: { "x-forwarded-for": "198.51.100.3" },
        body: {
          messages: [
            {
              id: "invalid-message",
              role: "user",
              parts: [{ type: "text", text: "   " }],
            },
          ],
        },
      }),
    );
    const error = await readError(response);

    expect(response.status).toBe(400);
    expect(error.code).toBe("invalid_payload");
    expect(error.details).toBeDefined();
    expect(streamTextMock).not.toHaveBeenCalled();
  });

  it("returns 429 with retry information after exceeding the rate limit", async () => {
    const headers = { "x-forwarded-for": "198.51.100.4" };

    for (let index = 0; index < 20; index += 1) {
      const response = await POST(createJsonRequest({ headers }));
      expect(response.status).toBe(200);
    }

    const rateLimitedResponse = await POST(createJsonRequest({ headers }));
    const error = await readError(rateLimitedResponse);

    expect(rateLimitedResponse.status).toBe(429);
    expect(rateLimitedResponse.headers.get("Retry-After")).toBeTruthy();
    expect(error.code).toBe("rate_limited");
    expect(error.details).toMatchObject({
      retryAfterSeconds: expect.any(Number),
    });
  });

  it("returns the streaming response on valid requests", async () => {
    const convertedMessages = [
      { role: "user", content: [{ type: "text", text: "テスト" }] },
    ];
    const streamingResponse = new Response("mock-stream", { status: 200 });
    const toUIMessageStreamResponseMock = vi
      .fn()
      .mockReturnValue(streamingResponse);

    convertToModelMessagesMock.mockResolvedValueOnce(convertedMessages);
    streamTextMock.mockReturnValueOnce({
      toUIMessageStreamResponse: toUIMessageStreamResponseMock,
    });

    const response = await POST(
      createJsonRequest({
        headers: { "x-real-ip": "203.0.113.5" },
      }),
    );

    expect(response).toBe(streamingResponse);
    expect(openaiMock).toHaveBeenCalledWith("gpt-4o-mini");
    expect(convertToModelMessagesMock).toHaveBeenCalledWith(
      validRequestBody.messages,
    );
    expect(streamTextMock).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "mock-model",
        system:
          "あなたは親切で丁寧な AI アシスタントです。日本語で回答してください。",
        messages: convertedMessages,
      }),
    );
    expect(toUIMessageStreamResponseMock).toHaveBeenCalledTimes(1);
  });
});
