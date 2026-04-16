import { NextResponse } from "next/server";
import { formatWeiToEther, normalizeHttpUrl } from "@/utils/rpc-utils";

export async function POST(request: Request) {
  let body: { rpcUrl?: string; address?: string } | undefined;
  try {
    body = (await request.json()) as { rpcUrl?: string; address?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rpcUrl = normalizeHttpUrl(body?.rpcUrl);
  const address = typeof body?.address === "string" ? body.address.trim() : "";
  if (!rpcUrl || !address) {
    return NextResponse.json({ error: "Missing rpcUrl or address" }, { status: 400 });
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
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "zeeve-frontend",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
        id: Date.now(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return NextResponse.json(
        { error: "RPC request failed", status: response.status, details: errorText || undefined },
        { status: 502 },
      );
    }

    const payload = (await response.json()) as { result?: string; error?: unknown };
    const balance = payload?.result ? formatWeiToEther(payload.result) : undefined;
    if (!balance) {
      return NextResponse.json(
        { error: "Invalid RPC response", details: payload?.error ?? payload ?? undefined },
        { status: 502 },
      );
    }

    return NextResponse.json({ balance });
  } catch {
    return NextResponse.json({ error: "Unable to fetch balance" }, { status: 502 });
  }
}
