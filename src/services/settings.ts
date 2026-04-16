import axios from "axios";

interface ChangePasswordPayload {
  email: string;
  current_password: string;
  new_password: string;
}

interface DeleteAccountTicketPayload {
  userEmail: string;
  userId?: string | number | null;
  userName?: string | null;
  phoneNumber?: string | null;
  reason?: string | null;
  additionalContext?: string | null;
}

interface DeleteAccountTicketResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

const getUserInfo = () => axios.get("/api/v1/user-info");

const changePassword = (payload: ChangePasswordPayload) => axios.post("/api/v1/change-password", payload);

const listSubscriptions = () => axios.get("/api/v1/subscriptions-list");

const listInvoices = () => axios.get("/api/v1/my_invoices");

const requestAccountDeletionTicket = async (payload: DeleteAccountTicketPayload) => {
  const response = await fetch("/api/support/delete-account", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let responseBody: DeleteAccountTicketResponse | null = null;
  try {
    responseBody = (await response.json()) as DeleteAccountTicketResponse;
  } catch {
    responseBody = null;
  }

  if (!response.ok || !responseBody?.success) {
    const message = responseBody?.message ?? "Unable to submit the deletion request.";
    throw new Error(message);
  }

  return responseBody;
};

export type { ChangePasswordPayload, DeleteAccountTicketPayload, DeleteAccountTicketResponse };
export { getUserInfo, changePassword, listSubscriptions, listInvoices, requestAccountDeletionTicket };
