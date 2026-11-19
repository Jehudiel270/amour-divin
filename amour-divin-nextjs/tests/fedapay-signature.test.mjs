import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";

import { verifyFedaPayWebhook } from "../lib/payments/fedapay-signature.ts";

const secret = "webhook-test-secret";
const payload = JSON.stringify({ id: "evt_1", name: "transaction.approved" });

function signedHeader(body, timestamp = Math.floor(Date.now() / 1000)) {
  const signature = createHmac("sha256", secret).update(`${timestamp}.${body}`, "utf8").digest("hex");
  return `t=${timestamp},s=${signature}`;
}

test("accepts a valid recent FedaPay signature", () => {
  assert.equal(verifyFedaPayWebhook(payload, signedHeader(payload), secret), true);
});

test("rejects a modified webhook body", () => {
  assert.equal(verifyFedaPayWebhook(`${payload} `, signedHeader(payload), secret), false);
});

test("rejects an expired webhook timestamp", () => {
  const timestamp = Math.floor(Date.now() / 1000) - 301;
  assert.equal(verifyFedaPayWebhook(payload, signedHeader(payload, timestamp), secret), false);
});

test("rejects a malformed signature header", () => {
  assert.equal(verifyFedaPayWebhook(payload, "s=not-a-signature", secret), false);
});
