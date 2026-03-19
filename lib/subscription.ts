type UserMetadata = Record<string, unknown> | null | undefined;

const PRO_EMAILS = new Set([
  "mamniashvili2003@gmail.com",
  "pokrasov.04@mail.ru",
  "moontour@yandex.ru",
]);

const PRO_IDENTIFIERS = new Set([
  "mamniash",
  "pokrasovdaniil",
  "alexgrabko",
  "александр мамниашвили",
  "pokrasov daniil",
  "nedv1ga",
  "SParfentiev",
  "alxswappls",
  "indigo_76",
  "anikakle",
  "imvdm",
  "IceKeePeRR",
  "le_aleeee",
  "karsar951",
  "redwynco",
  "vera_salve",
  "oribast",
  "monchik322",
  "sh_mksm",
  "d873_k",
  "TonyBanderas",
  "guerendi",
  "Olga_Shelekhova",
  "ProdByLev",
  "normacha1",
  "mercyein",
  "WhyNotIYes",
  "vandasung",
  "katelico",
  "mamin_zver",
  "may_lights",
  "mmohnov",
  "www_3dprintprops_com",
  "ponytabl",
  "7496006401",
]);

const PRO_TELEGRAM_IDS = new Set([2101651535, 975378496, 337548443]);
const TELEGRAM_ID_KEYS = [
  "telegram_id",
  "telegramId",
  "id",
  "ID",
  "tg_id",
  "tgId",
  "user_id",
  "userId",
];

const normalize = (value?: string | null) => value?.trim().toLowerCase() ?? "";

const getMetadataValue = (metadata: UserMetadata, key: string) =>
  typeof metadata?.[key] === "string" ? metadata[key].trim() : null;

const parseTelegramId = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;

  const normalizedValue = value.trim();
  if (!normalizedValue) return null;

  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const getTelegramIds = (metadata: UserMetadata) =>
  TELEGRAM_ID_KEYS.map((key) => parseTelegramId(metadata?.[key])).filter(
    (id): id is number => id !== null,
  );

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

  const telegramIds = getTelegramIds(metadata);
  return telegramIds.some((telegramId) => PRO_TELEGRAM_IDS.has(telegramId));
};
