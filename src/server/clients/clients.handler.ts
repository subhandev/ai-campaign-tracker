// src/server/clients/clients.handler.ts

import { NextRequest, NextResponse } from "next/server";
import {
  listClients,
  getClient,
  addClient,
  editClient,
  removeClient,
} from "@/server/clients/clients.service";
import { CreateClientInput, UpdateClientInput } from "@/features/clients/types";

export async function handleListClients(clerkUserId: string) {
  try {
    const data = await listClients(clerkUserId);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

export async function handleGetClient(id: string, clerkUserId: string) {
  try {
    const data = await getClient(id, clerkUserId);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "Client not found") {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to fetch client" },
      { status: 500 }
    );
  }
}

export async function handleCreateClient(
  req: NextRequest,
  clerkUserId: string
) {
  try {
    const body: CreateClientInput = await req.json();
    const data = await addClient(clerkUserId, body);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Client name is required"
    ) {
      return NextResponse.json(
        { error: "Client name is required" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}

export async function handleUpdateClient(
  req: NextRequest,
  id: string,
  clerkUserId: string
) {
  try {
    const body: UpdateClientInput = await req.json();
    const data = await editClient(id, clerkUserId, body);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "Client not found") {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 }
    );
  }
}

export async function handleDeleteClient(id: string, clerkUserId: string) {
  try {
    const data = await removeClient(id, clerkUserId);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "Client not found") {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 }
    );
  }
}