import { NextResponse } from "next/server";
import { normalizeHttpUrl } from "@/utils/rpc-utils";

const parseBlockHeight = (value?: string): number | string | undefined => {
  if (!value) return undefined;
  const normalized = value.startsWith("0x") ? value : `0x${value}`;
  try {
    const blockNumber = BigInt(normalized);
    const maxSafe = BigInt(Number.MAX_SAFE_INTEGER);
    return blockNumber > maxSafe ? blockNumber.toString() : Number(blockNumber);
  } catch {
    return undefined;
  }
};

export async function POST(request: Request) {
  let body: { rpcUrl?: string } | undefined;
  try {
    body = (await request.json()) as { rpcUrl?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rpcUrl = normalizeHttpUrl(body?.rpcUrl);
  if (!rpcUrl) {
    return NextResponse.json({ error: "Missing rpcUrl" }, { status: 400 });
  }

  try {
    const url = new URL(rpcUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return NextResponse.json({ error: "Invalid rpcUrl protocol" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid rpcUrl" }, { status: 400 });
  }

  try {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "eth_blockNumber",
        params: [],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "RPC request failed" }, { status: 502 });
    }

    const payload = (await response.json()) as { result?: string };
    const blockHeight = parseBlockHeight(payload?.result);
    if (blockHeight === undefined) {
      return NextResponse.json({ error: "Invalid RPC response" }, { status: 502 });
    }

    return NextResponse.json({ blockHeight });
  } catch {
    return NextResponse.json({ error: "Unable to fetch block height" }, { status: 502 });
  }
}
