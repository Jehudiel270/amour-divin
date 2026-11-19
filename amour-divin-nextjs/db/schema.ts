import {
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const profileStatus = pgEnum("profile_status", ["draft", "pending", "active", "suspended", "deleted"]);
export const photoStatus = pgEnum("photo_status", ["pending", "approved", "rejected"]);
export const requestStatus = pgEnum("request_status", ["pending", "accepted", "declined", "withdrawn"]);
export const subscriptionStatus = pgEnum("subscription_status", ["pending", "active", "expired", "canceled", "refunded"]);
export const paymentStatus = pgEnum("payment_status", ["pending", "approved", "declined", "canceled", "refunded"]);
export const reportStatus = pgEnum("report_status", ["pending", "reviewing", "resolved", "dismissed"]);
export const profileRole = pgEnum("profile_role", ["member", "admin", "super_admin"]);
export const contactStatus = pgEnum("contact_status", ["open", "closed"]);
export const adminPermission = pgEnum("admin_permission", ["dashboard", "users", "profiles", "reports", "contact", "billing", "content"]);

export const profiles = pgTable("profiles", {
  userId: text("user_id").primaryKey(),
  firstName: varchar("first_name", { length: 80 }).notNull(),
  birthDate: date("birth_date", { mode: "string" }).notNull(),
  city: varchar("city", { length: 120 }).notNull().default(""),
  countryCode: varchar("country_code", { length: 2 }).notNull().default(""),
  profession: varchar("profession", { length: 120 }).notNull().default(""),
  church: varchar("church", { length: 160 }).notNull().default(""),
  bio: varchar("bio", { length: 500 }).notNull().default(""),
  lookingFor: varchar("looking_for", { length: 500 }).notNull().default(""),
  faithValues: jsonb("faith_values").$type<string[]>().notNull().default([]),
  interests: jsonb("interests").$type<string[]>().notNull().default([]),
  status: profileStatus("status").notNull().default("draft"),
  role: profileRole("role").notNull().default("member"),
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("profiles_status_city_idx").on(table.status, table.city),
  index("profiles_created_at_idx").on(table.createdAt),
]);

export const adminPermissions = pgTable("admin_permissions", {
  userId: text("user_id").notNull().references(() => profiles.userId, { onDelete: "cascade" }),
  permission: adminPermission("permission").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.permission] }),
]);

export const profilePreferences = pgTable("profile_preferences", {
  userId: text("user_id").primaryKey().references(() => profiles.userId, { onDelete: "cascade" }),
  minAge: integer("min_age").notNull().default(18),
  maxAge: integer("max_age").notNull().default(70),
  maxDistanceKm: integer("max_distance_km").notNull().default(100),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  check("profile_preferences_age_range_check", sql`${table.minAge} >= 18 AND ${table.maxAge} >= ${table.minAge}`),
  check("profile_preferences_distance_check", sql`${table.maxDistanceKm} > 0`),
]);

export const profilePhotos = pgTable("profile_photos", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => profiles.userId, { onDelete: "cascade" }),
  publicId: varchar("public_id", { length: 255 }).notNull().unique(),
  secureUrl: text("secure_url").notNull(),
  position: integer("position").notNull(),
  status: photoStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("profile_photos_user_position_idx").on(table.userId, table.position),
  index("profile_photos_user_status_idx").on(table.userId, table.status),
  check("profile_photos_position_check", sql`${table.position} BETWEEN 0 AND 5`),
]);

export const favorites = pgTable("favorites", {
  userId: text("user_id").notNull().references(() => profiles.userId, { onDelete: "cascade" }),
  targetUserId: text("target_user_id").notNull().references(() => profiles.userId, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.targetUserId] }),
  check("favorites_not_self_check", sql`${table.userId} <> ${table.targetUserId}`),
]);

export const connectionRequests = pgTable("connection_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  senderId: text("sender_id").notNull().references(() => profiles.userId, { onDelete: "cascade" }),
  recipientId: text("recipient_id").notNull().references(() => profiles.userId, { onDelete: "cascade" }),
  message: varchar("message", { length: 500 }).notNull().default(""),
  status: requestStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("connection_requests_pending_pair_idx")
    .on(table.senderId, table.recipientId)
    .where(sql`${table.status} = 'pending'`),
  index("connection_requests_recipient_status_idx").on(table.recipientId, table.status),
  check("connection_requests_not_self_check", sql`${table.senderId} <> ${table.recipientId}`),
]);

export const matches = pgTable("matches", {
  id: uuid("id").defaultRandom().primaryKey(),
  userAId: text("user_a_id").notNull().references(() => profiles.userId, { onDelete: "cascade" }),
  userBId: text("user_b_id").notNull().references(() => profiles.userId, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("matches_pair_idx").on(table.userAId, table.userBId),
  check("matches_sorted_pair_check", sql`${table.userAId} < ${table.userBId}`),
]);

export const conversations = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  matchId: uuid("match_id").notNull().unique().references(() => matches.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const conversationMembers = pgTable("conversation_members", {
  conversationId: uuid("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => profiles.userId, { onDelete: "cascade" }),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.conversationId, table.userId] }),
]);

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  senderId: text("sender_id").notNull().references(() => profiles.userId, { onDelete: "cascade" }),
  content: varchar("content", { length: 4000 }).notNull(),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("messages_conversation_created_idx").on(table.conversationId, table.createdAt),
]);

export const reports = pgTable("reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  reporterId: text("reporter_id").notNull().references(() => profiles.userId, { onDelete: "cascade" }),
  targetUserId: text("target_user_id").notNull().references(() => profiles.userId, { onDelete: "cascade" }),
  reason: varchar("reason", { length: 80 }).notNull(),
  details: varchar("details", { length: 4000 }).notNull().default(""),
  status: reportStatus("status").notNull().default("pending"),
  assignedAdminId: text("assigned_admin_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
}, (table) => [
  index("reports_status_created_idx").on(table.status, table.createdAt),
  check("reports_not_self_check", sql`${table.reporterId} <> ${table.targetUserId}`),
]);

export const blocks = pgTable("blocks", {
  blockerId: text("blocker_id").notNull().references(() => profiles.userId, { onDelete: "cascade" }),
  blockedId: text("blocked_id").notNull().references(() => profiles.userId, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.blockerId, table.blockedId] }),
  check("blocks_not_self_check", sql`${table.blockerId} <> ${table.blockedId}`),
]);

export const subscriptionPlans = pgTable("subscription_plans", {
  code: varchar("code", { length: 40 }).primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  description: varchar("description", { length: 240 }).notNull().default(""),
  amountXof: integer("amount_xof").notNull(),
  durationDays: integer("duration_days").notNull(),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  check("subscription_plans_amount_check", sql`${table.amountXof} >= 100`),
  check("subscription_plans_duration_check", sql`${table.durationDays} > 0`),
]);

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => profiles.userId, { onDelete: "cascade" }),
  planCode: varchar("plan_code", { length: 40 }).notNull(),
  status: subscriptionStatus("status").notNull().default("pending"),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("subscriptions_user_status_idx").on(table.userId, table.status, table.endsAt),
]);

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => profiles.userId, { onDelete: "cascade" }),
  subscriptionId: uuid("subscription_id").references(() => subscriptions.id, { onDelete: "set null" }),
  provider: varchar("provider", { length: 24 }).notNull().default("fedapay"),
  providerTransactionId: varchar("provider_transaction_id", { length: 120 }).unique(),
  merchantReference: varchar("merchant_reference", { length: 120 }).notNull().unique(),
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),
  status: paymentStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("payments_user_created_idx").on(table.userId, table.createdAt),
  check("payments_amount_positive_check", sql`${table.amount} > 0`),
]);

export const webhookEvents = pgTable("webhook_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  provider: varchar("provider", { length: 24 }).notNull(),
  providerEventId: varchar("provider_event_id", { length: 180 }).notNull(),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  payload: jsonb("payload").notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("webhook_events_provider_event_idx").on(table.provider, table.providerEventId),
]);

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => profiles.userId, { onDelete: "cascade" }),
  kind: varchar("kind", { length: 40 }).notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull().default({}),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("notifications_user_created_idx").on(table.userId, table.createdAt),
]);

export const adminActions = pgTable("admin_actions", {
  id: uuid("id").defaultRandom().primaryKey(),
  adminUserId: text("admin_user_id").notNull(),
  action: varchar("action", { length: 80 }).notNull(),
  targetUserId: text("target_user_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("admin_actions_admin_created_idx").on(table.adminUserId, table.createdAt),
]);

export const legalConsents = pgTable("legal_consents", {
  userId: text("user_id").notNull(),
  consentType: varchar("consent_type", { length: 32 }).notNull(),
  documentVersion: varchar("document_version", { length: 32 }).notNull(),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.consentType, table.documentVersion] }),
  check("legal_consents_type_check", sql`${table.consentType} IN ('terms', 'privacy')`),
]);

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 80 }).notNull(),
  message: varchar("message", { length: 4000 }).notNull(),
  status: contactStatus("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("contact_messages_status_created_idx").on(table.status, table.createdAt),
]);
