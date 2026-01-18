type UserMetadata = Record<string, unknown> | null | undefined;

const PRO_EMAILS = new Set([
  "mamniashvili2003@gmail.com",
  "pokrasov.04@mail.ru",
]);

const PRO_IDENTIFIERS = new Set([
  "mamniash",
  "pokrasovdaniil",
  "александр мамниашвили",
  "pokrasov daniil",
]);

const PRO_TELEGRAM_IDS = new Set([2101651535, 975378496]);

const normalize = (value?: string | null) => value?.trim().toLowerCase() ?? "";

const getMetadataValue = (metadata: UserMetadata, key: string) =>
  typeof metadata?.[key] === "string" ? metadata[key].trim() : null;

const getTelegramId = (metadata: UserMetadata) =>
  typeof metadata?.telegram_id === "number" ? metadata.telegram_id : null;

export const isProUser = (options?: {
  email?: string | null;
  metadata?: UserMetadata;
}) => {
  const email = normalize(options?.email ?? null);
  if (email && PRO_EMAILS.has(email)) return true;

  const metadata = options?.metadata;
  const username = normalize(getMetadataValue(metadata, "username"));
  const firstName = normalize(getMetadataValue(metadata, "first_name"));
  const lastName = normalize(getMetadataValue(metadata, "last_name"));
  const fullName = normalize(getMetadataValue(metadata, "full_name"));
  const name = normalize(getMetadataValue(metadata, "name"));
  const combinedName = [firstName, lastName].filter(Boolean).join(" ");

  const identifiers = [
    username,
    firstName,
    lastName,
    fullName,
    name,
    combinedName,
  ].filter(Boolean);

  if (identifiers.some((identifier) => PRO_IDENTIFIERS.has(identifier))) {
    return true;
  }

  const telegramId = getTelegramId(metadata);
  return telegramId ? PRO_TELEGRAM_IDS.has(telegramId) : false;
};
